import React, { useEffect, useRef, useState } from "react";
import "./App.scss";
import Form from "react-bootstrap/Form";
import { Suburb } from "../../interfaces/userDetails";
import StorageService from "../../service/storage.service";
import { StorageKeys } from "../../enums/storageKeys";
import NewSuburb from "../Shared/NewSuburb/NewSuburb";
function App() {
  var msg = "Please wait";
  const [processing, setProcessing] = useState(false);
  const [daySelected, setDaySelected] = useState(5);
  const daysSelection = useRef<any>();
  const [suburbListData, setSuburbListData] = useState<Array<Suburb>>();
  const storageService = StorageService.getInstance();
  useEffect(() => {
    storageService.getData(StorageKeys.suburbList,[]).then((x) => {
      setSuburbListData(x);
    });
    storageService.getData(StorageKeys.defaultDays).then((x) => {
      setDaySelected(x);
    });
  }, []);

  var saveDays = () => {
    var e = daysSelection.current;
    var sel = e.selectedIndex;
    var opt = e.options[sel];
    var curValue = opt.value;
    storageService.saveData(StorageKeys.defaultDays, curValue);
  };

  return (
    <div className="App">
      <div
        id="overlay"
        className={`${processing === true ? "overlay" : "hideOverlay"}`}
      >
        <div>{msg}</div>
      </div>
      <>
        <Form.Group className="mb-3">
          <Form.Label>Days to show</Form.Label>
          <Form.Select ref={daysSelection} onChange={saveDays}>
            <option>{chrome.i18n.getMessage('defaultSelector')}</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => {
              return (
                <option
                  value={x-1}
                  selected={x.toString() === daySelected?.toString()}
                >
                  {x}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
        <NewSuburb
          suburbList={suburbListData}
          onSuburbListChanged={(e) => setSuburbListData(e)}
          onIsBusyChanged={(b) => {setProcessing(b)}}
        ></NewSuburb>
      </>
    </div>
  );
}

export default App;
