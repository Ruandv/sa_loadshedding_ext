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
  onIsBusyChanged: isBusyProcessing,
}: NewSuburbProps) {
  const ruanService = RuanService.getInstance();
  const storageService = StorageService.getInstance();
  const loggingService = LoggingService.getInstance();
  const [loading, setLoading] = useState({});
  const selection = useRef<any>();
  const municipalitySelection = useRef<any>();
  const [list, setList] = useState({} as Municipality);

  const MunicipalityList = [
    { id: 166, name: "City of Johannesburg" },
    { id: 167, name: "Tshwane" },
  ];
  var doneYet = useRef(true);
  var c = 0;
  const checkBack = () =>
    setTimeout(function () {
      if (doneYet.current === false) {
        setLoading({
          isLoading: true,
          message: "The server is taking its time..." + c,
        });
        c = c + 1;
        checkBack();
      } else {
        loggingService.echo("PROCESSING DONE", undefined, undefined, "warning");
        setLoading({ isLoading: false, message: "DONE!" });
      }
    }, 2000);

  useEffect(() => {
    isBusyProcessing!(loading);
  }, [loading]);

  useEffect(() => {
    if (doneYet.current === true) {
      isBusyProcessing!({ isLoading: false, message: "DONE" });
    }
  }, [doneYet.current]);

  var removeSuburb = (x: Suburb) => {
    var c = [...suburbList!];
    var sel = c.findIndex((r) => r === x);
    c.splice(sel, 1);

    storageService.saveData(StorageKeys.suburbList, c);
    loggingService.LogToServer(MessageTypes.SUBURBREMOVED, {
      suburbName: x.subName,
    });
    onSuburbListChanged(c);
  };

  var addSuburb = () => {
    var mun = municipalitySelection.current;
    var munSel = mun.selectedIndex;
    var munOpt = mun.options[munSel];
    var munValue = munOpt.value;

    var c = [...suburbList!];
    var e = selection.current;
    var sel = e.selectedIndex;
    var opt = e.options[sel];
    var curValue = opt.value;
    var curText = opt.text;
    c.push({ blockId: curValue, subName: curText, municipalityId: munValue });
    storageService.saveData(StorageKeys.suburbList, c);
    loggingService.LogToServer(MessageTypes.SUBURBADDED, {
      suburbName: curText,
    });
    onSuburbListChanged(c);
  };

  const updateSuburbs = async (e: any) => {
    var curValue = e.target.value;
    doneYet.current = false;
    const getSuburbs = async () => {
      try {
        setList(await ruanService.getSuburbData(curValue));
      } catch (err) {
        setLoading({
          isLoading: true,
          message: "ERROR TRYING TO RETRIEVE SUBURBS",
        });
      } finally {
      }
    };
    getSuburbs();
  };

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
              if (list!.Suburbs!.indexOf(x) === list.Suburbs.length - 1) {
                doneYet.current = true;
              }
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
