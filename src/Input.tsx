import * as React from 'react';

interface IProps {
  submit: (text: string) => void
}

interface IState {
  text: string
}

export default class Input extends React.Component<IProps, IState> {
  public readonly state: IState = {
    text: ""
  }
  public textInput?: React.RefObject<HTMLInputElement>;

  constructor(props: IProps) {
    super(props);
    this.textInput = React.createRef();
  }

  public componentDidMount(){
    if(this.textInput 
      && this.textInput.current 
      && typeof this.textInput.current.focus === "function"
    ){
      this.textInput.current.focus();
    }
  }

  public render(){
    return (
      <div className="container">
        <input
          ref={this.textInput}
          className="input"
          value={this.state.text} 
          onChange={this.onHandleChange}
          onKeyPress={this.onHandleKeypress}
          placeholder="What needs doing ?"
        />
      </div>
    )
  }

  private onHandleChange = (event: React.FormEvent<HTMLInputElement>): void => {
		const value = (event.target as HTMLInputElement).value;
		this.setState({
			text: value
		});
  }
  
  private onHandleKeypress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter"){
      this.props.submit(this.state.text)
      this.setState({
        text: ""
      })

      if(this.textInput 
        && this.textInput.current 
        && typeof this.textInput.current.blur === "function"
      ){
        this.textInput.current.blur();
      }
    }
  }
}

