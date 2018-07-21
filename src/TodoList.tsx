import * as React from 'react';
import './App.css';

import { ITodo } from "./Interfaces";

interface IState {
  startX: number,
  currentX: number,
  screenX: number,
  targetX: number,
  draggingCard: boolean,
  activeId?: string | null,
}

interface IProps {
  todos: ITodo[],
  remove: (id: string) => void
}

class TodoList extends React.Component<IProps, IState> {
  public state: IState = {
    startX: 0,
    currentX: 0,
    screenX: 0,
    targetX: 0,
    draggingCard: false,
    activeId: null,
  }

  public targetBCR?: any;
  public target?: any;

  constructor(props: IProps){
    super(props)
    requestAnimationFrame(this.update);
  }

  public render() {
    return (
      <div className="container">

      {this.props.todos.map((card, i) => 
        <div
          style={(this.state.activeId === card.id) ? 
            this.activeStyles : 
            this.defaultStyles
          }
          onMouseDown={(e) => this.onStartMouse(e, card.id)}
          onMouseMove={this.onMoveMouse}
          onMouseUp={this.onEnd}
          onTouchStart={(e) => this.onStartTouch(e, card.id)}
          onTouchMove={this.onMoveTouch}
          onTouchEnd={this.onEnd}
          key={card.id} 
          className="card">
          {card.text}
        </div>
      )}
    </div>
    );
  }

  private get activeStyles(){
    const normalizedDragDistance =
      (Math.abs(this.state.screenX) / this.targetBCR.width);
    return {
      transform: `translateX(${this.state.screenX}px)`,
      opacity: 1 - Math.pow(normalizedDragDistance, 3),
      willChange: 'transform'
    }
  }

  private get defaultStyles(){
    return {
      transform: "none",
      opacity: 1,
      willChange: 'initial',
    }
  }

  private onStartMouse = (evt: React.MouseEvent<HTMLElement>, id: string) => {
    this.target = evt.target;
    this.targetBCR = this.target.getBoundingClientRect();

    const startX = evt.pageX;
    
    this.setState({
      startX,
      currentX: startX,
      draggingCard: true,
      activeId: id
    })
    evt.preventDefault();
  }

  private onStartTouch = (evt: React.TouchEvent<HTMLElement>, id: string) => {
    this.target = evt.target;
    this.targetBCR = this.target.getBoundingClientRect();

    const startX = evt.touches[0].pageX;

    this.setState({
      startX,
      currentX: startX,
      draggingCard: true,
      activeId: id
    })
  }


  private onMoveMouse = (evt: React.MouseEvent<HTMLElement>) => {
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

  private onMoveTouch = (evt: React.TouchEvent<HTMLElement>) => {
    this.setState({
      currentX: evt.touches[0].pageX
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

  private onEnd = () => {
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

  private update = () => {
    requestAnimationFrame(this.update);

    if (!this.target || !this.state.activeId) {
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

      // Bail
      if (!this.state.activeId) {
        return;
      }
      this.props.remove(this.state.activeId)
      
      this.setState({
        activeId: null,
      })

    } else if (isNearlyAtStart) {
      this.resetTarget();
    }
  }

  private resetTarget = () => {
    if (!this.target){
      return;
    }
    this.target = null;
      
    this.setState({
      activeId: null,
    })
  }
}

export default TodoList;

