export interface ISignField {
  label: string;
  value: string;
  type: string;
  changeValue: React.Dispatch<React.SetStateAction<string>>;
  clearError?: React.Dispatch<React.SetStateAction<string>>;
}
