type Props = {
  title: string;
  meta: string;

  onTitleChange: (
    value: string
  ) => void;

  onMetaChange: (
    value: string
  ) => void;
};

export function TaskFormFields({
  title,
  meta,
  onTitleChange,
  onMetaChange,
}: Props) {
  return (
    <>
      <div>
        <label className="nothing-label">
          Title
        </label>

        <input
          className="nothing-input"
          value={title}
          onChange={(e) =>
            onTitleChange(
              e.target.value
            )
          }
          placeholder="What needs doing?"
        />
      </div>

      <div>
        <label className="nothing-label">
          Meta
        </label>

        <input
          className="nothing-input"
          value={meta}
          onChange={(e) =>
            onMetaChange(
              e.target.value
            )
          }
          placeholder="design · 2h"
        />
      </div>
    </>
  );
}