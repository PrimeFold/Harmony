type Props = {
  title: string;

  onTitleChange: (
    value: string
  ) => void;
};

export function TaskFormFields({
  title,
  onTitleChange,
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
    </>
  );
}