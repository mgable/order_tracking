import React from 'react';
import { Button } from 'react-bootstrap';

export class CustomToggle extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    console.info("xxxx", e);
    this.props.onClick(e);
  }

  render() {
    return (
      <Button onClick={this.handleClick}>
        {this.props.children}
      </Button>
    );
  }
}

export class CustomMenu extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);

    this.state = { value: '' };
  }

  handleChange(e) {
    console.info("I changed", e);
    this.setState({ value: e.target.value.toLowerCase().trim() });
  }

  render() {
    const {
      children,
      style,
      className,
      'aria-labelledby': labeledBy,
    } = this.props;

    return (
      <div style={style} className={className} aria-labelledby={labeledBy}>
          <ul className="list-unstyled" id="filter-menu">
            {React.Children.toArray(children)}
          </ul>
      </div>
    );
  }
}