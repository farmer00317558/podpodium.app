interface IProps {
  text: string;
  emoji?: string;
}
export default function Empty(props: IProps) {
  const { text, emoji } = props;
  return (
    <div className="flex flex-col justify-center items-center h-40">
      {emoji && <div className="mb-4 text-3xl">{emoji}</div>}
      <div className="text-xs text-gray-300">{text}</div>
    </div>
  );
}
