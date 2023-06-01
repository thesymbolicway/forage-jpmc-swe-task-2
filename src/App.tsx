import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import { Graph } from './Graph';
import './App.css';

interface IState {
  data: ServerRespond[];
  showGraph: boolean;
}

class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false,
    };
  }

  renderGraph() {
    if (this.state.showGraph) {
      return <Graph data={this.state.data} />;
    } else {
      return null;
    }
  }

  getDataFromServer() {
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        if (serverResponds.length === 0) {
          clearInterval(interval);
        } else {
          this.setState((prevState) => ({
            data: [...prevState.data, ...serverResponds],
            showGraph: true,
          }));
        }
      });
    }, 100);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => {
              this.getDataFromServer();
            }}
          >
            Start Streaming Data
          </button>
          <div className="Graph">{this.renderGraph()}</div>
        </div>
      </div>
    );
  }
}

export default App;
