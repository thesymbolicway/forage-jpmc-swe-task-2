import React, { Component, HTMLAttributes } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

interface IProps {
  data: ServerRespond[];
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}

export class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return <perspective-viewer {...(this.props as HTMLAttributes<HTMLElement>)} />;
  }

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      elem.load(this.table);

      // Configure Perspective attributes for the desired graph
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["top_ask_price"]');
      elem.setAttribute('aggregates', '{"stock":"distinct count", "top_ask_price":"avg"}');
    }
  }

  componentDidUpdate() {
    if (this.table) {
      const data: Record<string, (string | number | boolean | Date)[]> = {
        stock: this.props.data.map((el) => el.stock),
        top_ask_price: this.props.data.map((el) => el.top_ask?.price as number || 0),
        top_bid_price: this.props.data.map((el) => el.top_bid?.price as number || 0),
        timestamp: this.props.data.map((el) => el.timestamp),
      };
      
      
      this.table.update(data);
    }
  }
}
