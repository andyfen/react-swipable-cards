import * as React from 'react';

interface IProps {
  submit: (text: string) => void
}

interface IState {
  text: string
}

export default class Input extends React.Component<IProps, IState> {
  public state: IState = {
    text: ""
  }

  public render(){
    return (
      <div className="container">
        <input
          className="input"
          value={this.state.text} 
          onChange={this.onHandleChange}
          onKeyPress={this.onHandleKeypress}
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
   }
  }
}

