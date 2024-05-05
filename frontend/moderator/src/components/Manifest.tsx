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
          <p className=" tracking-widest font-mono text-teal-800 ">
            {item.content}
          </p>
        </div>
      ))}
    </div>
  );
};

const ManifestComponent: React.FC = () => {
  return (
    <div className=" min-h-screen py-8 w-8/12 sm:w-6/12 mx-auto">
      <div className="container mx-auto px-4 ">
        <div className="text-4xl  font-bold mb-8 uppercase tracking-widest text-center">
          <h1> Манифест</h1>
          <h2 className="--tracking-widest">Национального Мусорного Проекта</h2>
        </div>
        <ManifestArticle manifestItems={MANIFESTO} />
      </div>
    </div>
  );
};

export default ManifestComponent;
