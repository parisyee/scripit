var ScriptElement = React.createClass({
  ELEMENT_TYPES: {
    action: "action",
    character: "character",
    dialogue: "dialogue",
    heading: "heading",
    parenthetical: "parenthetical",
    transition: "transition"
  },

  KEYCODES: {
    backspace: 8,
    carriageRetrun: 13,
    tab: 9,
  },

  NEXT_ELEMENT_SEQUENCE_MAP: {
    "heading": "action",
    "action": "character",
    "character": "dialogue",
    "dialogue": "character",
    "transition": "heading"
  },

  TYPE_COLOR_MAP: {
    "action": "lightgreen",
    "character": "lightblue",
    "dialogue": "yellow",
    "heading": "pink",
    "parenthetical": "lightpurple",
    "transition": "orange"
  },

  propTypes: {
    element: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    onElementCreated: React.PropTypes.func.isRequired,
    onElementRemoved: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return { element: this.props.element }
  },

  handleBackspaceKeydown: function(event) {
    if(this.state.element.text === "") {
      event.preventDefault();
      this.props.onElementRemoved(this.props.index)
    }
  },

  handleReturnKeydown: function() {
    if (this.state.element.text === "") {
      this.setState(function(oldState) {
        var element = oldState.element;
        element.type = this.NEXT_ELEMENT_SEQUENCE_MAP[element.type];

        return { element: element };
      }, this.handleChange);
    } else {
      this.props.onElementCreated(this.props.index);
    }
  },

  handleTabKeydown: function(event) {
    this.setState(function(oldState) {
      var newType;
      var element = oldState.element;

      if (event.shiftKey) {
        newType = this.ELEMENT_TYPES.transition;
      } else {
        newType = this.nextElementType(element.type);
      }
      element.type = newType;

      return { element: element };
    }, this.handleChange);
  },

  nextElementType: function(type) {
    return this.NEXT_ELEMENT_SEQUENCE_MAP[type];
  },

  componentDidMount: function() {
    var BACKSPACE_KEYCODE = this.KEYCODES.backspace;
    var CARRIAGE_RETRUN_KEYCODE = this.KEYCODES.carriageRetrun;
    var TAB_KEYCODE = this.KEYCODES.tab;
    var handleBackspaceKeydown = this.handleBackspaceKeydown;
    var handleReturnKeydown = this.handleReturnKeydown;
    var handleTabKeydown = this.handleTabKeydown;
    var node = ReactDOM.findDOMNode(this);

    $(node).keydown(function(event) {
      if (event.keyCode === BACKSPACE_KEYCODE) {
        handleBackspaceKeydown(event);
      }
      if (event.keyCode === CARRIAGE_RETRUN_KEYCODE) {
        event.preventDefault();
        handleReturnKeydown();
      }
      if (event.keyCode === TAB_KEYCODE) {
        event.preventDefault();
        handleTabKeydown(event);
      }
    });
  },

  classNames: function() {
    var classes = "script-element " + this.state.element.type;

    if (this.state.element.type === "character") {
      classes += " uk-width-medium-1-3 uk-push-1-3";
    } else if (this.state.element.type === "dialogue") {
      classes += " uk-width-medium-3-5 uk-push-1-5";
    } else {
      classes += " uk-width-1-1";
    }

    return classes;
  },

  elementStyles: function() {
    var styles = {
      background: this.TYPE_COLOR_MAP[this.state.element.type],
      minHeight: "25px",
      outline: "none",
      "fontFamily": "'Courier New', Courier, monospace",
      "fontWeight": "bold"
    };

    if (this.state.element.type === "heading" ||
        this.state.element.type === "character" ||
        this.state.element.type === "transition"
       ) {
      styles.textTransform = "uppercase";
    }

    return styles;
  },

  elementID: function() {
    return this.state.element.type + "-" + this.props.index;
  },

  handleChange: function() {
    this.props.onElementChange(this.props.index, this.state.element);
  },

  handleInput: function(event) {
    this.setState(function(oldState) {
      var element = oldState.element;
      element.text = event.target.value;

      return { element: element };
    }, this.handleChange);
  },

  render: function() {
    return (
      <textarea
        className={this.classNames()}
        id={this.elementID()}
        style={this.elementStyles()}
        onChange={this.handleInput}
        value={this.state.element.text} />
    );
  }
});
