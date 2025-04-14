import { MouseEventHandler } from "react";
import { CloseOutlined } from '@ant-design/icons';

export default function AreaInfoBox({ name, count, average, onClose }:
  { name: string | undefined, count: number, average: number, onClose: MouseEventHandler }) {

  return (
    <div className="area-infobox">
      <div className="area-infobox-title"><b><u>{name}</u></b></div>
      {count > 0 ?
        <div className="area-infobox-body">
          <b>Restaurants:</b> {count}
          <br />
          <b>Average price:</b> {average.toFixed(1)} kr
        </div>
        : <p>Data missing</p>
      }
      <a onClick={onClose} className="area-infobox-close"><CloseOutlined /></a>
    </div>
  );
}
