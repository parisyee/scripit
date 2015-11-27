var ScriptEditor = React.createClass({
  AUTOSAVE_TIMER: null,

  NEW_ELEMENT_SEQUENCE_MAP: {
    "heading": "action",
    "action": "character",
    "character": "dialogue",
    "dialogue": "heading"
  },

  getInitialState: function() {
    return {
      documentID: this.props.documentID,
      elements: this.props.elements,
      title: this.props.title
    };
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    if (nextProps.documentID !== this.props.documentID) {
      this.setState({
        elements: nextProps.elements,
        title: nextProps.title
      });
    }

    return true;
  },

  url: function() {
    var id;
    if (this.props.documentID) {
      id = "/" + this.props.documentID;
    } else {
      id = "";
    }
    return this.props.url + id;
  },

  method: function() {
    return this.props.documentID ? "PUT" : "POST";
  },

  saveDocument: function() {
    $.ajax({
      url: this.url(),
      method: this.method(),
      data: {
        document: {
          title: this.state.title,
          content: JSON.stringify(this.state.elements)
        }
      },
      dataType: "json",
      success: function(data) {
        document.getElementById("autosave-indicator").innerHTML = "Changes Saved";
        if (!this.props.documentID) {
          this.setState({
            documentID: data.id
          });
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },

  queueAutosave: function() {
    if (this.AUTOSAVE_TIMER) {
      clearTimeout(this.AUTOSAVE_TIMER);
    }

    document.getElementById("autosave-indicator").innerHTML = "Saving Changes...";

    this.AUTOSAVE_TIMER = setTimeout(function() {
      this.saveDocument();
      this.AUTOSAVE_TIMER = null;
    }.bind(this), 2000);
  },

  insertNewElement: function(index) {
    var nextIndex = index + 1;
    var nextType = this.NEW_ELEMENT_SEQUENCE_MAP[this.state.elements[index].type];
    var nextElement = { type: nextType, text: "" };
    var nextID = nextType + "-" + nextIndex;

    this.setState(function(oldState) {
      var elements = oldState.elements.concat([]);
      elements.splice(nextIndex, 0, nextElement)

      return { elements: elements };
    }, function() {
      $("#" + nextID).focus();
    });
  },

  handleElementChange: function(index, type, text) {
    this.setState(function(oldState) {
      var elements = oldState.elements;
      elements.splice(index, 1, { type: type, text: text });

      return { elements: elements };
    }, this.queueAutosave);
  },

  elementNodes: function() {
    var nodes = this.state.elements.map(function(element, i) {
      return (
        <ScriptElement
          key={i}
          index={i}
          type={element.type}
          text={element.text}
          onElementChange={this.handleElementChange}
          onReturnKeydown={this.insertNewElement} />
      );
    }.bind(this));

    return nodes;
  },

  render: function() {
    return (
      <div className="document-editor uk-width-2-3">
        <div id="autosave-indicator"></div>
        <form className="uk-form">
          <div className="uk-form-row">
            <input
              className="uk-width-1-1"
              type="text"
              name="document[title]"
              value={this.state.title}
              onChange={this.handleChange}
              ref="title" />
          </div>
        </form>
        {this.elementNodes()}
      </div>
    );
  }
});
