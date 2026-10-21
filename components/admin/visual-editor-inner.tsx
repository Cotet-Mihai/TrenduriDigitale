"use client";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  Separator,
  StrikeThroughSupSubToggles,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { uploadImage } from "@/lib/upload-image";

const RO: Record<string, string> = {
  "toolbar.undo": "Anulează {{shortcut}}",
  "toolbar.redo": "Refă {{shortcut}}",
  "toolbar.bold": "Îngroșat",
  "toolbar.removeBold": "Elimină îngroșarea",
  "toolbar.italic": "Înclinat",
  "toolbar.removeItalic": "Elimină înclinarea",
  "toolbar.strikethrough": "Tăiat",
  "toolbar.removeStrikethrough": "Elimină tăierea",
  "toolbar.bulletedList": "Listă cu buline",
  "toolbar.numberedList": "Listă numerotată",
  "toolbar.link": "Adaugă link",
  "toolbar.image": "Adaugă imagine",
  "toolbar.table": "Adaugă tabel",
  "toolbar.thematicBreak": "Linie de separare",
  "toolbar.codeBlock": "Bloc de cod",
  "toolbar.richText": "Editor vizual",
  "toolbar.source": "Markdown",
  "toolbar.blockTypeSelect.placeholder": "Tip text",
  "toolbar.blockTypeSelect.selectBlockTypeTooltip": "Alege tipul de text",
  "toolbar.blockTypes.paragraph": "Paragraf",
  "toolbar.blockTypes.quote": "Citat",
  "toolbar.blockTypes.heading": "Titlu {{level}}",
  "createLink.url": "Adresă (URL)",
  "createLink.urlPlaceholder": "Lipește adresa linkului",
  "createLink.text": "Text afișat",
  "createLink.textTooltip": "Textul pe care se dă click",
  "createLink.title": "Titlu (opțional)",
  "createLink.titleTooltip": "Apare când treci cu mouse-ul peste link",
  "createLink.saveTooltip": "Salvează linkul",
  "createLink.cancelTooltip": "Renunță",
  "linkPreview.edit": "Editează linkul",
  "linkPreview.remove": "Elimină linkul",
  "linkPreview.copyToClipboard": "Copiază",
  "linkPreview.copied": "Copiat!",
  "uploadImage.dialogTitle": "Adaugă o imagine",
  "uploadImage.dialogDescription": "Încarcă o imagine de pe calculator sau folosește o adresă de pe internet.",
  "uploadImage.uploadInstructions": "Încarcă de pe calculator:",
  "uploadImage.addViaUrlInstructions": "Sau folosește adresa unei imagini:",
  "uploadImage.autoCompletePlaceholder": "https://…",
  "uploadImage.alt": "Legendă (apare sub imagine):",
  "uploadImage.title": "Titlu (opțional):",
  "imageEditor.editImage": "Editează imaginea",
  "imageEditor.deleteImage": "Șterge imaginea",
  "dialogControls.save": "Salvează",
  "dialogControls.cancel": "Renunță",
  "dialog.close": "Închide",
  "table.deleteTable": "Șterge tabelul",
  "table.insertRowAbove": "Rând deasupra",
  "table.insertRowBelow": "Rând dedesubt",
  "table.deleteRow": "Șterge rândul",
  "table.insertColumnLeft": "Coloană la stânga",
  "table.insertColumnRight": "Coloană la dreapta",
  "table.deleteColumn": "Șterge coloana",
  "table.columnMenu": "Opțiuni coloană",
  "table.rowMenu": "Opțiuni rând",
  "table.textAlignment": "Aliniere text",
  "table.alignLeft": "Stânga",
  "table.alignCenter": "Centru",
  "table.alignRight": "Dreapta",
  "codeBlock.language": "Limbaj",
  "codeBlock.selectLanguage": "Alege limbajul",
  "codeblock.delete": "Șterge blocul de cod",
};

function translate(key: string, fallback: string, vars?: Record<string, unknown>): string {
  const text = RO[key] ?? fallback;
  return text.replace(/\{\{(\w+)\}\}/g, (_, name) => String(vars?.[name] ?? ""));
}

interface Props {
  markdown: string;
  onChange: (markdown: string) => void;
  onError: (message: string) => void;
}

export default function VisualEditorInner({ markdown, onChange, onError }: Props) {
  return (
    <MDXEditor
      markdown={markdown}
      onChange={(md, initialNormalize) => {
        if (!initialNormalize) onChange(md);
      }}
      onError={({ error }) => onError(error)}
      translation={translate}
      placeholder="Începe să scrii aici…"
      spellCheck
      className="td-editor"
      contentEditableClassName="td-editor-content"
      toMarkdownOptions={{ bullet: "-", emphasis: "*", strong: "*" }}
      plugins={[
        // H2 = secțiune (apare în cuprins), H3/H4 = subtitluri — la fel ca pe site.
        headingsPlugin({ allowedHeadingLevels: [2, 3, 4] }),
        listsPlugin(),
        quotePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        // Resizing would emit raw <img width> HTML, which the public article page does not render.
        imagePlugin({ imageUploadHandler: uploadImage, disableImageResize: true }),
        tablePlugin(),
        thematicBreakPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "text" }),
        codeMirrorPlugin({
          codeBlockLanguages: { text: "Text", js: "JavaScript", ts: "TypeScript", html: "HTML", css: "CSS", bash: "Terminal", json: "JSON", python: "Python" },
        }),
        markdownShortcutPlugin(),
        diffSourcePlugin({ viewMode: "rich-text" }),
        toolbarPlugin({
          toolbarClassName: "td-editor-toolbar",
          toolbarContents: () => (
            <DiffSourceToggleWrapper options={["rich-text", "source"]}>
              <UndoRedo />
              <Separator />
              <BlockTypeSelect />
              <Separator />
              <BoldItalicUnderlineToggles options={["Bold", "Italic"]} />
              <StrikeThroughSupSubToggles options={["Strikethrough"]} />
              <Separator />
              <ListsToggle options={["bullet", "number"]} />
              <Separator />
              <CreateLink />
              <InsertImage />
              <InsertTable />
              <InsertThematicBreak />
              <InsertCodeBlock />
            </DiffSourceToggleWrapper>
          ),
        }),
      ]}
    />
  );
}
