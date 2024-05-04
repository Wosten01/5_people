import { MANIFESTO } from "../data_samples/manifesto";

interface ManifestItem {
  title: string;
  content: string;
}

const ManifestArticle: React.FC<{ manifestItems: ManifestItem[] }> = ({
  manifestItems,
}) => {
  return (
    <div className="">
      {manifestItems.map((item, index) => (
        <div className="mb-8" key={index}>
          <h2 className="text-2xl  mb-2 tracking-widest">{item.title}</h2>
          <p className=" tracking-widest font-mono text-amber-900 ">
            {item.content}
          </p>
        </div>
      ))}
    </div>
  );
};

const ManifestComponent: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4 ">
        <h1 className="text-4xl  font-bold mb-8 uppercase --tracking-widest text-center">
          Манифест Национального Мусорного Проекта
        </h1>
        <ManifestArticle manifestItems={MANIFESTO} />
      </div>
    </div>
  );
};

export default ManifestComponent;
