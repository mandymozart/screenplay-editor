import styled from '@emotion/styled';
import { useState, useRef, useEffect } from 'react';
import { Button } from '../asciicore-ui';
import useScreenplayStore from '../../stores/useScreenplayStore';

// Styled components
const Container = styled.div`
  margin-bottom: 1em;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const ActionButtons = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  gap: 0;
  line-height: 1rem;
  margin: 0;
`

const ActionContentContainer = styled.pre`
  color: ${(props) => {
    if (props.isEditing) {
      return 'var(--edit-primary)'; 
    }
    return props.status === 'Copied' || props.status === 'Saved' ? 'green' : 'inherit';
  }};
  /* background: ${(props) => (props.isEditing ? 'var(--edit-background)' : 'var(--background)')}; */
  white-space: pre-wrap;
  box-sizing: border-box;
  cursor: ${(props) => (props.isEditing ? 'text' : 'pointer')};
  outline: none;
`;

const MAX_LINE_LENGTH = 62;
const INDENT = '    '; // 4 spaces

const breakIntoLines = (text) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = INDENT;

  words.forEach((word) => {
    if (currentLine.length + word.length + 1 > MAX_LINE_LENGTH) {
      lines.push(currentLine);
      currentLine = INDENT + word + ' ';
    } else {
      currentLine += word + ' ';
    }
  });

  if (currentLine.trim().length > 0) {
    lines.push(currentLine);
  }

  return lines;
};

const ActionContent = ({ text, status, isEditing, contentRef, onClick }) => {
  const lines = breakIntoLines(text);

  return (
    <ActionContentContainer
      ref={contentRef}
      status={status}
      contentEditable={isEditing}
      suppressContentEditableWarning
      isEditing={isEditing}
      onClick={onClick}
    >
      {lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </ActionContentContainer>
  );
};

const Action = ({ initialText = '', beatId, sceneNumber, sceneIndex, sceneEventIndex }) => {
  const [text, setText] = useState(initialText);
  const [status, setStatus] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef(null);
  const containerRef = useRef(null);

  const updateEvent = useScreenplayStore((state) => state.updateEvent);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
      setTimeout(() => setStatus(''), 500); // Reset status after 0.5 seconds
    } catch (error) {
      setStatus('Failed');
      console.error('Copy error:', error);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      cancelEdit();
    } else {
      edit();
    }
    setIsEditing(!isEditing);
  };

  const edit = () => {
    console.log('Edit mode enabled');
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (contentRef.current) {
      const currentText = Array.from(contentRef.current.childNodes)
        .map((node) => node.textContent.trim())
        .join(' ');
  
      if (currentText !== initialText) {
        console.log('Changes detected.');
      } else {
        console.log('No changes detected.');
      }
  
      const formattedLines = breakIntoLines(initialText);
      const formattedText = formattedLines.join('\n');
      contentRef.current.innerText = formattedText;
      setText(initialText);
    }
    console.log('Edit mode disabled');
    setIsEditing(false);
  };
  

  const save = () => {
    if (contentRef.current) {
      const updatedText = Array.from(contentRef.current.childNodes)
        .map((node) => node.textContent.trim())
        .join(' ');

      updateEvent(beatId, sceneIndex, sceneEventIndex, { text: updatedText });
      setText(updatedText);
      console.log('Text saved:', updatedText);

      setStatus('saved');
      setTimeout(() => setStatus(''), 500); // Reset status after 0.5 seconds
    }
    setIsEditing(false);
  };

  const handleClickOutside = (event) => {
    if (
      isEditing &&
      containerRef.current &&
      !containerRef.current.contains(event.target)
    ) {
      const currentText = Array.from(contentRef.current.childNodes)
        .map((node) => node.textContent.trim())
        .join(' ');
  
      if (currentText !== initialText) {
        const userConfirmed = window.confirm(
          'Changes were made. Do you want to save changes?'
        );
        if (userConfirmed) {
          save();
        } else {
          cancelEdit();
        }
      } else {
        console.log('No changes detected, exiting edit mode.');
        setIsEditing(false);
      }
    }
  };
  

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  return (
    <Container ref={containerRef}>
      <ActionContent
        text={text}
        status={status}
        isEditing={isEditing}
        contentRef={contentRef}
        onClick={edit} // Enable edit mode when clicking on the content
      />
      <ActionButtons>
        <Button onClick={handleCopy} active={status === 'copied'} className="button--copy">
          {status === 'Copied' ? 'COPIED' : 'COPY'}
        </Button>
        {isEditing && (
          <Button onClick={save} active={status === 'saving'} className="button--save">
            SAVE
          </Button>
        )}
        <Button onClick={toggleEdit} active={status==='saved'} className="button--edit">
          {isEditing ? 'CANCEL' : status ? status : 'EDIT'}
        </Button>
      </ActionButtons>
    </Container>
  );
};

export default Action;
