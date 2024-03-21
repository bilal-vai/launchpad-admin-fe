import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Card, CardBody, Col, Row } from "reactstrap";

import { useSelector, useDispatch } from "react-redux";
import {
  getBridgeConfigLyo,

} from "../../store/bridge/actions";

const BridgeInfoLyo = () => {
  const [bridgeInfo, setBridgeInfo] = useState([]);

  const dispatch = useDispatch();
  const { responseConfig } =
    useSelector((state) => ({
      responseConfig: state.bridge.responseConfigLyo,

    }));

  useEffect(() => {
    dispatch(getBridgeConfigLyo());
  }, []);


  useEffect(() => {
    if (responseConfig.status === 200) {
      setBridgeInfo(responseConfig.data.data);
    }
  }, [responseConfig]);


  return (
    <React.Fragment>
      <Col xl={3}>
        <Card className="card-h-100 card-info info-primary">
          <CardBody>
            <h5 className="card-title me-2">Main Bridge</h5>
            <br />
            {/* <h3>{bridgeInfo ? bridgeInfo.mainChain : "-"}</h3> */}

            {Object.keys(bridgeInfo).length > 0 ? (
              <h3>{bridgeInfo.mainChain}</h3>
            ) : (
              <h5 className="card-title placeholder-glow">
                <span className="placeholder col-5"></span>
              </h5>
            )}
          </CardBody>
        </Card>
      </Col>
      <Col xl={3}>
        <Card className="card-h-100 card-info info-success">
          <CardBody>
            <h5 className="card-title me-2">Main Bridge Volume</h5>
            <br />
            {/* <h3>{bridgeInfo ? bridgeInfo.tokenVolume : "-"}</h3> */}

            {Object.keys(bridgeInfo).length > 0 ? (
              <h3>{bridgeInfo.tokenVolume}</h3>
            ) : (
              <h5 className="card-title placeholder-glow">
                <span className="placeholder col-5"></span>
              </h5>
            )}
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default BridgeInfoLyo;
