import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Transforms, Node, Editor, Element as SlateElement } from 'slate';
import { Button } from "../components/ui/Button"
import Fuse from "fuse.js"

const UnorderedListEditor = ({ initialValue=[""], onListChange, suggestions=[{}] }) => {
  const fuse = new Fuse(suggestions, { keys: ["description"] });
  
  const editor = useMemo(() => withReact(createEditor()), []);

  const [value, setValue] = useState(initialValue);
  const [buttonText, setButtonText] = useState((suggestions[0]||{}).description);

  const renderElement = useCallback(({ element, attributes, children }) => {
    switch (element.type) {
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      default:
        return <p {...attributes}>{children}</p>;
    }
  }, []);

  const handleChange = (newValue) => {
    setValue(newValue);
    const items = newValue
      .filter((n) => n.type === 'list-item')
      .map((n) => Node.string(n));
    onListChange(items);
  };

  const handleUpdateCurrentItem = () => {
    const { selection } = editor;
  if (!selection) return;

  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.type === 'list-item',
  });

  if (match) {
    const [node, path] = match;

    // Remove the existing children (text) and insert new text
    const textPath = [...path, 0]; // Path to the text node inside list-item

    Transforms.delete(editor, { at: textPath });
    Transforms.insertText(editor, buttonText, { at: textPath });
  }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const newItem = {
        type: 'list-item',
        children: [{ text: '' }],
      };
      Transforms.insertNodes(editor, newItem);
    }
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n.type === 'list-item',
    });

    if (match) {
      const [node] = match;
      const currentText = Node.string(node);
      const suggestion = fuse.search(currentText, {keys: ["description"]});
      if(suggestion.length) {
        setButtonText(suggestion[0].item.description);
      } else {
        setButtonText((suggestions[0]||{}).description);
      }
    }
  };

  return (
    <div>
      {buttonText && <Button onClick={handleUpdateCurrentItem} size="sm" className="p-2 mb-2 max-w-[70vw] h-full">
        {buttonText}
      </Button>}
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <ul
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '22px',
            minHeight: '100px',
            listStyleType: 'disc'
          }}
          className="bg-background"
        >
          <Editable
            renderElement={renderElement}
            onKeyDown={handleKeyDown}
            placeholder="Enter diet here..."
            spellCheck={false}
            className="px-2 text-2xl font-bold touch-none select-text outline-none max-h-[30vh] overflow-y-scroll list-disc pl-6 overflow-x-hidden"
          />
        </ul>
      </Slate>
      
    </div>
  );
};

export default UnorderedListEditor;
