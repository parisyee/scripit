var ScriptElement = React.createClass({
  TYPE_COLOR_MAP: {
    "heading": "pink",
    "action": "lightgreen",
    "character": "lightblue",
    "dialogue": "yellow"
  },

  NEXT_ELEMENT_SEQUENCE_MAP: {
    "heading": "action",
    "action": "character",
    "character": "dialogue",
    "dialogue": "character"
  },

  getInitialState: function() {
    return {
      type: this.props.type,
      text: this.props.text
    };
  },

  handleReturnKeydown: function() {
    if(this.state.text === "") {
      this.setState(function(oldState) {
        return {
          type: this.NEXT_ELEMENT_SEQUENCE_MAP[oldState.type]
        };
      }, this.handleChange);
    } else {
      this.props.onReturnKeydown(this.props.index);
    }
  },

  componentDidMount: function() {
    var handleReturnKeydown = this.handleReturnKeydown;
    var node = ReactDOM.findDOMNode(this);

    $(node).keydown(function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        handleReturnKeydown();
      }
    });
  },

  classNames: function() {
    return "script-element uk-width-1-1 " + this.state.type;
  },

  elementStyles: function() {
    var styles = {
      background: this.TYPE_COLOR_MAP[this.state.type],
      minHeight: "25px"
    };

    if (this.state.type === "heading" || this.state.type === "character") {
      styles.textTransform = "uppercase";
    }

    return styles;
  },

  elementID: function() {
    return this.state.type + "-" + this.props.index;
  },

  placeCaretAtEnd: function(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
          var range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(false);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
          var textRange = document.body.createTextRange();
          textRange.moveToElementText(el);
          textRange.collapse(false);
          textRange.select();
        }
  },

  handleChange: function() {
    this.props.onElementChange(this.props.index, this.state.type, this.state.text);
  },

  handleInput: function() {
    this.setState({
      text: this.refs.element.innerText
    }, function() {
      this.placeCaretAtEnd(
        document.getElementById(this.elementID())
      );
      this.handleChange();
    });
  },

  render: function() {
    return (
      <div className={this.classNames()}
        id={this.elementID()}
        style={this.elementStyles()}
        onInput={this.handleInput}
        ref="element"
        contentEditable="true">
        {this.state.text}
      </div>
    );
  }
});
