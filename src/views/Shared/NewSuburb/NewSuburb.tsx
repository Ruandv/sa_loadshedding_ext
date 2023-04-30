import React, { useEffect, useRef, useState } from "react";
import "./NewSuburb.scss";
import { Badge, Button, CloseButton, Form } from "react-bootstrap";
import { Municipality, Province, Suburb } from "../../../interfaces/userDetails";
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
  const [municipalityList, setMunicipalityList] = useState<Municipality[]>([]);
  const municipalitySelection = useRef<any>();
  const suburbSelection = useRef<any>();
  const provinceSelection = useRef<any>();
  const [searchList, setSearchList] = useState<Suburb[]>([]);

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

  let provinceList = useRef<Province[]>([
    { "ProvinceId": 1, "ProvinceName": "Eastern Cape", Municipalities: [] },
    { "ProvinceId": 2, "ProvinceName": "Free State", Municipalities: [] },
    { "ProvinceId": 3, "ProvinceName": "Gauteng", Municipalities: [] },
    { "ProvinceId": 4, "ProvinceName": "KwaZulu-Natal", Municipalities: [] },
    { "ProvinceId": 5, "ProvinceName": "Limpopo", Municipalities: [] },
    { "ProvinceId": 6, "ProvinceName": "Mpumalanga", Municipalities: [] },
    { "ProvinceId": 7, "ProvinceName": "North West", Municipalities: [] },
    { "ProvinceId": 8, "ProvinceName": "Northern Cape", Municipalities: [] },
    { "ProvinceId": 9, "ProvinceName": "Western Cape", Municipalities: [] }
  ]);

  var removeSuburb = (x: Suburb) => {
    var c = [...suburbList!];
    var sel = c.findIndex((r) => r === x);
    c.splice(sel, 1);

    storageService.saveData(StorageKeys.suburbList, c);
    loggingService.LogToServer(MessageTypes.SUBURBREMOVED, {
      suburbName: x.name,
    });
    onSuburbListChanged(c);
  };

  var addSuburb = () => {
    var munValue = municipalitySelection.current.selectedOptions[0].value;
    var suburb = JSON.parse(suburbSelection.current.selectedOptions[0].value);
    if (suburb) {
      var c = [...suburbList!];
      c.push({ blockId: suburb.blockId, name: suburb.name, municipalityId: munValue } as Suburb);
      storageService.saveData(StorageKeys.suburbList, c);
      loggingService.LogToServer(MessageTypes.SUBURBADDED, {
        suburbName: suburb.name,
      });
      provinceSelection.current = undefined;
      
      municipalitySelection.current = undefined;
      suburbSelection.current = undefined;

      onSuburbListChanged(c);
    }
    else {
      console.error("Suburb not found : " + suburbSelection.current.value)
    }
  };

  const updateMunicipalityList = async () => {
    checkBack();
    doneYet.current = false;
    await ruanService.getMunicipalityList(provinceSelection.current.selectedOptions[0].value).then(x => {
      doneYet.current = true;
      provinceSelection.current.Municipalities = x;
      setMunicipalityList(x);
    });
  }

  const updateSuburbsList = () => {
    checkBack();
    doneYet.current = false;
    ruanService.getSuburbData(provinceSelection.current.selectedOptions[0].value, municipalitySelection.current.selectedOptions[0].value).then(x => {
      doneYet.current = true;
      setSearchList(x.Suburbs);
    });
  }

  return (
    <div className="newSuburbContainer">
      <>
        <Form.Group className="mb-3">
          <Form.Label>Province</Form.Label>
          <Form.Select ref={provinceSelection} onChange={() => updateMunicipalityList()}>
            <option>Please select</option>
            {provinceList.current?.map((x) => {
              return <option value={x.ProvinceId}>{x.ProvinceName}</option>;
            })}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Municipality List</Form.Label>
          <Form.Select ref={municipalitySelection} onChange={() => updateSuburbsList()} >
            <option>Please select</option>
            {municipalityList.map((x: Municipality) => {
              return <option value={x.Value}>{x.Text}</option>;
            })}
          </Form.Select>
        </Form.Group>
        <Form.Group className={`mb-3`}>
          <Form.Label>Suburb List</Form.Label>
          <Form.Select ref={suburbSelection} >
            <option>Please select</option>
            {searchList.map((x: Suburb, i: number) => {
              return <option value={JSON.stringify(x)}>{x.name}</option>;
            })}
          </Form.Select>
          <Form.Text id="helpBlock" muted>
        * indicates a direct eskom client.
      </Form.Text>
        </Form.Group>
        <Form.Group className={`mb-3`}>
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
                  {x.name}
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
