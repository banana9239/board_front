import React, { useState } from 'react';
import { EditorState, RichUtils } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import { Box, Button, Input, Text } from '@chakra-ui/react';

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];


export default function TestEditor() {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const onChange = (value:EditorState) => {
        setEditorState(value);
    }
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const contentState = editorState.getCurrentContent();
                const contentStateWithEntity = contentState.createEntity(
                    'IMAGE',
                    'IMMUTABLE',
                    { src: reader.result }
                );
                const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
                const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
                setEditorState(EditorState.forceSelection(
                    newEditorState,
                    newEditorState.getCurrentContent().getSelectionAfter()
                ));
            };
            reader.readAsDataURL(file);
        }
    }
    const handleKeyCommand = (command: string, editorState: EditorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    };
    const toggleBold = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    };

    const toggleBulletList = () => {
        setEditorState(RichUtils.toggleBlockType(editorState, 'unordered-list-item'));
    };

    return (
        <Box py={5} px={10} width={"100%"} height={"400px"}>
            <Button onClick={toggleBold} mr={2}>Bold</Button>
            <Button onClick={toggleBulletList} mr={2}>Bullet List</Button>
            
            <Editor 
                editorState={editorState} 
                onChange={onChange} 
                plugins={plugins}
                handleKeyCommand={handleKeyCommand}
            />
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            <Text>Hi</Text>
        </Box>

    )
}