type Props = {
  filtersOpen: boolean;
  onToggleFilters: () => void;
  sortValue: string;
  onSortChange: (value: string) => void;
};

export function ProductToolbar({
  filtersOpen,
  onToggleFilters,
  sortValue,
  onSortChange,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onToggleFilters}
        className="bg-gray-100 px-4 py-2 rounded"
      >
        {filtersOpen ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="ml-auto">
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-gray-100 border p-2 rounded"
        >
          <option value="TITLE">Title</option>
          <option value="PRICE">Price</option>
        </select>
      </div>
    </div>
  );
}
