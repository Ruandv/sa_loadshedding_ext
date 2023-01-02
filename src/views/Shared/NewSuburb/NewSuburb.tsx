import React, { useEffect, useRef, useState } from "react";
import "./NewSuburb.scss";
import { Badge, Button, CloseButton, Form } from "react-bootstrap";
import { Municipality, Suburb } from "../../../interfaces/userDetails";
import RuanService from "../../../service/ruan.service";
import { StorageKeys } from "../../../enums/storageKeys";
import StorageService from "../../../service/storage.service";
import LoggingService from "../../../service/logging.service";
import { MessageTypes } from "../../../enums/messageTypes";

export interface NewSuburbProps {
  suburbList?: Array<Suburb>;
  onSuburbListChanged: (list: Array<Suburb>) => void;
  onIsBusyChanged?: (data: any) => void;
}
function NewSuburb({
  suburbList,
  onSuburbListChanged,
  onIsBusyChanged,
}: NewSuburbProps) {
  const ruanService = RuanService.getInstance();
  const storageService = StorageService.getInstance();
  const loggingService = LoggingService.getInstance();
  const [loading, setLoading] = useState(false);
  const selection = useRef<any>();
  const municipalitySelection = useRef<any>();
  const [list, setList] = useState({} as Municipality);
  const [message, setMessage] = useState<string>("Please wait...");
  const MunicipalityList = [
    { id: 166, name: "City of Johannesburg" },
    { id: 167, name: "Tshwane" },
  ];
  var doneYet = true;
  useEffect(() => {
    setTimeout(function () {
      if (doneYet == false) {
        onIsBusyChanged!({ isBusy: !loading, message: message });
      }
    }, 1000);
  }, [loading, message]);
  useEffect(() => {
    
  }, []);

  var removeSuburb = (x: Suburb) => {
    var c = [...suburbList!];
    var sel = c.findIndex((r) => r === x);
    c.splice(sel, 1);

    storageService.saveData(StorageKeys.suburbList, c);
    loggingService.LogToServer(MessageTypes.SUBURBREMOVED, {
      SuburbName: x.subName,
    });
    onSuburbListChanged(c);
  };

  var addSuburb = () => {
    var c = [...suburbList!];
    var e = selection.current;
    var sel = e.selectedIndex;
    var opt = e.options[sel];
    var curValue = opt.value;
    var curText = opt.text;
    c.push({ blockId: curValue, subName: curText });
    storageService.saveData(StorageKeys.suburbList, c);
    loggingService.LogToServer(MessageTypes.SUBURBADDED, {
      SuburbName: curText,
    });
    onSuburbListChanged(c);
  };

  const updateSuburbs = async(e:any)=>{
      
    var curValue = e.target.value;
  //  var curText = opt.text;
    setMessage("Please wait");
    setLoading(true);
    doneYet = false;
    const getSuburbs = async () => {
      try {
        setList(await ruanService.getSuburbData(curValue));
        doneYet = true;
        setLoading(false);
      } catch (err) {
        console.log("ERROR");
        setMessage("Error trying to fetch suburb data");
      } finally {
      }
    };
    getSuburbs();
  }

  return (
    <div>
      <>
        <Form.Group className="mb-3">
          <Form.Label>Municipality List</Form.Label>
          <Form.Select ref={municipalitySelection} onChange={updateSuburbs}>
            <option>Please select</option>
            {MunicipalityList?.map((x) => {
              return <option value={x.id}>{x.name}</option>;
            })}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Suburb List</Form.Label>
          <Form.Select ref={selection}>
            <option>Please select</option>
            {list?.Suburbs?.map((x) => {
              return <option value={x.blockId}>{x.subName}</option>;
            })}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Button
            variant="primary"
            onClick={() => {
              addSuburb();
            }}
          >
            Add
          </Button>
        </Form.Group>
        <Form.Group className="mb-3">
          {suburbList?.map((x) => {
            return (
              <>
                <Badge pill bg="primary">
                  {x.subName}
                  <CloseButton onClick={() => removeSuburb(x)} />
                </Badge>{" "}
              </>
            );
          })}
        </Form.Group>
      </>
    </div>
  );
}

export default NewSuburb;
