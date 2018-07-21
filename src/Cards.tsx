import * as React from 'react';
import './App.css';

interface ICard {
  id: string;
  text: string;
}

interface IState {
  cards: ICard[],
  startX: number,
  currentX: number,
  screenX: number,
  targetX: number,
  draggingCard: boolean,
  activeId: string | null,
}

class Cards extends React.Component<{}, IState> {
  public state: IState = {
    cards: [
      {id: "1", text: "Das Surma" },
      {id: "2", text: "Aerotwist" },
      {id: "3", text: "Kinlanimus Maximus" },
      {id: "4", text: "Addyoooooooooo"},
      {id: "5", text: "Gaunty McGaunty Gaunt" },
      {id: "6", text: "Jack Archibungle" },
      {id: "7", text: "Sam The Dutts Dutton" },
    ],
    startX: 0,
    currentX: 0,
    screenX: 0,
    targetX: 0,
    draggingCard: false,
    activeId: null,
  }

  public targetBCR: any | null;
  public target: any | null;

  constructor(props: {}){
    super(props)
    requestAnimationFrame(this.update);
  }

  public render() {
    return (
      <div className="card-container">
      <small>startX: {this.state.startX}</small><br/>
      <small>currentX: {this.state.currentX}</small><br/>
      <small>screenX: {this.state.screenX}</small><br/>
      <small>targetX: {this.state.targetX}</small><br/>
      <small>draggingCard: {this.state.draggingCard ? "dragging" : "not dragging"}</small><br/>
    <small>activeId: {this.state.activeId} .</small><br/>

      {this.state.cards.map(card => 
        <div
          style={(this.state.activeId === card.id) ? this.activeStyles : this.defaultStyles}
          onMouseDown={(e) => this.onStart(e, card.id)}
          onMouseMove={this.onMove}
          onMouseUp={this.onEnd}
          key={card.id } 
          className="card">
          {card.text}
        </div>
      )}
    </div>
    );
  }

  public get activeStyles(){
    const normalizedDragDistance =
      (Math.abs(this.state.screenX) / this.targetBCR.width);
    return {
      transform: `translateX(${this.state.screenX}px)`,
      opacity: 1 - Math.pow(normalizedDragDistance, 3),
      willChange: 'transform'
    }
  }

  public get defaultStyles(){
    return {
      transform: "none",
      opacity: 1,
      willChange: 'initial'
    }
  }

  public onStart = (evt: React.MouseEvent<HTMLElement>, id: string) => {
    this.target = evt.target;
    this.targetBCR = this.target.getBoundingClientRect();

    this.setState({
      startX: evt.pageX,
      currentX: evt.pageX,
      draggingCard: true,
      activeId: id
    })

    evt.preventDefault();
  }

  public onMove = (evt: React.MouseEvent<HTMLElement>) => {
    this.setState({
      currentX: evt.pageX
    })

    if (this.state.draggingCard) {
      this.setState({
        screenX: this.state.currentX - this.state.startX
      })
    } else {
      this.setState({
        screenX: this.state.screenX + (this.state.targetX - this.state.screenX) / 4
      })
    }
  }

  public onEnd = () => {
    if (!this.state.activeId) {
      return
    }

    this.setState({
      targetX: 0,
    })

    const screenX = this.state.currentX - this.state.startX;
    const threshold = this.targetBCR.width * 0.35;

    if (Math.abs(screenX) > threshold) {
      this.setState({
        targetX: (screenX > 0) ?
        this.targetBCR.width :
       -this.targetBCR.width
      })
    }

    this.setState({
      draggingCard: false
    })
  }

  public update = () => {
    requestAnimationFrame(this.update);

    if (!this.target /* || !this.state.activeId*/) {
      return;
    }

    if (this.state.draggingCard) {
      this.setState({
        screenX: this.state.currentX - this.state.startX
      })
    } else {
      this.setState({
        screenX: this.state.screenX + (this.state.targetX - this.state.screenX) / 4
      })
    }

    // Wait till user has finished dragging.
    if (this.state.draggingCard){
      return
    }

    const isNearlyAtStart = (Math.abs(this.state.screenX) < 0.1);
    const isNearlyInvisible = (this.activeStyles.opacity < 0.01);

    // If the card is nearly gone.
    if (isNearlyInvisible) {

      // Bail if there's no target or it's not attached to a parent anymore.
      if (!this.state.activeId) {
        return;
      }

      this.setState({
        cards: this.state.cards.filter(card => card.id !== this.state.activeId),
        activeId: null,
      })

      // Slide all the other cards.
      // this.animateOtherCardsIntoPosition(targetIndex);

    } else if (isNearlyAtStart) {
      this.target = null;
      
      this.setState({
        activeId: null,
      })
      // this.resetTarget();
    }
  }

  public animateOtherCardsIntoPosition = (startIndex: number) => {
    // If removed card was the last one, there is nothing to animate.
    // Remove the target.
    if (startIndex === this.state.cards.length) {
      this.resetTarget();
      return;
    }

    const onAnimationComplete = (evt: any) => {
      const card = evt.target;
      card.removeEventListener('transitionend', onAnimationComplete);
      card.style.transition = '';
      card.style.transform = '';

      this.resetTarget();
    };

    // Set up all the card animations.
    for (let i = startIndex; i < this.state.cards.length; i++) {
      // const card = this.state.cards[i];

      // Move the card down then slide it up.
      // card.style.transform = `translateY(${this.targetBCR.height + 20}px)`;
      // card.addEventListener('transitionend', onAnimationComplete);
    }

    // Now init them.
    requestAnimationFrame(_ => {
      for (let i = startIndex; i < this.state.cards.length; i++) {
       // const card = this.state.cards[i];

        // Move the card down then slide it up, with delay according to "distance"
        // card.style.transition = `transform 150ms cubic-bezier(0,0,0.31,1) ${i*50}ms`;
        // card.style.transform = '';
      }
    });
  }

  public resetTarget = () => {
    if (!this.target){
      return;
    }

    this.target.style.willChange = 'initial';
    this.target.style.transform = 'none';
    this.target = null;
  }
}

export default Cards;

