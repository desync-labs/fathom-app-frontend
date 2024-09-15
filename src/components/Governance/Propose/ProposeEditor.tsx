import { Editor } from "react-draft-wysiwyg";
import { useController } from "react-hook-form";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FC } from "react";
import editorSettings from "utils/editor";
import { styled } from "@mui/material";

type ProposeEditorProps = {
  editorName: string;
  control: any;
};

const EditorWrapper = styled("div")`
  .rdw-editor-wrapper {
    border-radius: 8px;
    border: 1px solid #2c4066;
    background: #091433;
    padding: 4px;
  }

  .editor-class {
    padding: 8px 6px 8px 16px;
    min-height: 100px;
  }

  &.error {
    .rdw-editor-wrapper {
      border-color: #dd3c3c;
    }
  }

  .rdw-option-wrapper,
  .rdw-dropdown-wrapper {
    background: transparent;
    border: 1px solid #071028;
    border-radius: 4px;

    ${({ theme }) => theme.breakpoints.down("sm")} {
      height: 20px;
    }

    &:hover {
      box-shadow: 2px 2px 0 #071028;
    }
    &.rdw-option-active {
      box-shadow: 2px 2px 0 #071028 inset;
    }
    .rdw-dropdown-selectedtext {
      color: #071028;
    }
  }
  .rdw-option-wrapper {
    min-width: 16px;
    height: 18px;
    margin: 0 3px;
    ${({ theme }) => theme.breakpoints.down("sm")} {
      width: 12px;
      height: 10px;
    }
  }

  .rdw-dropdownoption-highlighted,
  .rdw-dropdownoption-active {
    background: #071028;
  }

  .rdw-embedded-modal,
  .rdw-link-modal,
  .rdw-colorpicker-modal, 
  .rdw-image-modal, 
  .rdw-emoji-modal {
    background: #1e2f4d;
    box-shadow: 3px 3px 5px #071028;
    border: 1px solid #071028;

    input {
      background: #091433;
      border-radius: 4px;
      border: none;
      color: #fff;
      height: 25px !important;
    }

    button {
        background: transparent;
        color: #43FFF1;
        font-weight: bold;
        font-size: 15px;
        line-height: 20px;
        padding: 8px;
        gap: 8px;
        border: 1px solid #009E92;
        border-radius: 8px;
        height: 12px;
        width: auto;
        display: flex;
        align-items: center;
        &:hover {
            background: transparent;
            color: #B3FFF9;
            border: 1px solid #B3FFF9; 
            svg {
                color: #B3FFF9;
            },
        }
        &:disabled {
            color: gray;
            background: transparent;
            border-color: gray;
            cursor: not-allowed !important;
            pointer-events: all !important;
        }
    }
      .rdw-image-modal-btn-section, 
      .rdw-link-modal-buttonsection {
          display: flex;
      }
  }
  .rdw-link-modal {
      input {
          margin-bottom: 5px;
      }
  }

  .rdw-dropdown-optionwrapper {
    background: #1e2f4d;
    border-radius: 4px;
    border: none;

    &:hover {
      box-shadow: 2px 2px 0px #071028;
    }
    &.rdw-option-active {
      box-shadow: 2px 2px 0px #071028 inset;
    }
  }

  .toolbar-class {
    border-radius: 8px;
    border: 1px solid #1e2f4d;
    background: #1e2f4d;
    box-shadow: 0px 9px 27px 0px rgba(0, 0, 0, 0.07),
      0px 3.76px 11.28px 0px rgba(0, 0, 0, 0.05),
      0px 2.01px 6.031px 0px rgba(0, 0, 0, 0.04),
      0px 1.127px 3.381px 0px rgba(0, 0, 0, 0.04),
      0px 0.599px 1.796px 0px rgba(0, 0, 0, 0.03),
      0px 0.249px 0.747px 0px rgba(0, 0, 0, 0.02);
  }

  .public-DraftEditorPlaceholder-inner {
    color: #4f658c;
  }

  .rdw-block-wrapper,
  .rdw-fontsize-wrapper,
  .rdw-fontfamily-wrapper {
    width: 100px;
  }
  .rdw-fontsize-wrapper {
    width: 50px;
  }
`;

const EditorError = styled("div")`
  font-size: 12px;
  color: #dd3c3c;
`;

const ProposeEditor: FC<ProposeEditorProps> = ({ editorName, control }) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: editorName,
    control,
    rules: {
      validate: (value: EditorState) =>
        value.getCurrentContent().getPlainText().length > 0
          ? true
          : `Field ${editorName} is required`,
    },
    defaultValue: EditorState.createEmpty(),
  });

  return (
    <>
      <EditorWrapper className={error ? "error" : ""}>
        <Editor
          editorState={field.value}
          toolbar={editorSettings}
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
          onEditorStateChange={field.onChange}
          onBlur={field.onBlur}
          placeholder={"Ex: Describe how you propose new way in details..."}
        />
      </EditorWrapper>
      {error && (
        <EditorError>
          <> {error && <>Field {editorName} is required</>} </>
        </EditorError>
      )}
    </>
  );
};

export default ProposeEditor;
