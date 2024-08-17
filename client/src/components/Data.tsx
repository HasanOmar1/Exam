import { DataType } from "../types/dataTypes";

const Data = ({ description, img, title, url }: DataType) => {
  return (
    <div className="data">
      <div>
        <h4>URL</h4>
        <a href={url} id="url" target="_blank">
          {url}
        </a>
      </div>
      <div>
        <h4>Meta Title</h4>
        <p>{title}</p>
      </div>
      <div>
        <h4>Meta Description</h4>
        <p>{description}</p>
      </div>
      <img src={img} alt={title} />
    </div>
  );
};

export default Data;
