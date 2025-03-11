import "./styles.css";

export interface SearchInputProps {
  statics: {
    label: string;
    placeHolder: string;
    onChange: (value: string) => void;
  };
  state: {
    value: string;
    isValid: boolean;
    errorMessage: string;
    showError: boolean;
  };
}
const SearchInput: React.FC<SearchInputProps> = ({ state, statics }) => {
  return (
    <div className="search-input-wrapper">
      <label className="search-input-label">{statics.label}</label>
      <input
        onChange={(e) => statics.onChange(e.target.value)}
        className="search-input-input"
        type="text"
        value={state.value}
        placeholder={statics.placeHolder}
      />
      <span className="search-input-error">{!state.isValid && state.showError ? state.errorMessage : null}</span>
    </div>
  );
};
export default SearchInput;
