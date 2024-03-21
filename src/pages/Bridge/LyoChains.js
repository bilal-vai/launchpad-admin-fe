import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
const Web3 = require("web3");
import Moment from "react-moment";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Helmet } from "react-helmet";
import MUIDataTable from "mui-datatables";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip } from "@nextui-org/react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  FormFeedback,
  Form,
  Label,
  Input,
  CardTitle,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import Dropzone from "react-dropzone";
//redux
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";
import ReactDataTable from "../../common/ReactDataTable";
import isEmpty from "../../utils/isEmpty";
import { apiBridgeUrlLFI, apiBridgeUrlLYO, apiUrl } from "../../config";
import Swal from "sweetalert2";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { createChainLyo, updateChainLyo, removeChainLyo } from "../../store/bridge/actions";

const LyoChains = (props) => {
  const dispatch = useDispatch();
  const refreshTableData = useRef(null);
  const { chainsResponse, responseAdd, responseRemove, responseUpdate } = useSelector((state) => ({
    chainsResponse: state.bridge.chainsResponseLyo,
    responseAdd: state.bridge.responseAddLyo,
    responseRemove: state.bridge.responseRemoveLyo,
    responseUpdate: state.bridge.responseUpdateLyo,
  }));



  const [chainData, setChainData] = useState();
  const [activeTabFormStep, setActiveTabFormStep] = useState(1);
  const [isOpenAddEditModal, toggleAddEditModal] = useState(false);
  const { auth, launchpad } = useSelector((state) => ({
    auth: state.auth,
    launchpad: state.launchpad,
  }));
  const {
    lauchpadDeployHistory,
    isLoading,
    isDeploying,
    stageResponse,
    deployStageResponse,
    updatedLaunchpadResponse,
    updatedLaunchpadStages,
  } = launchpad;
  let otherCopy;
  const { response, notifications, networkInfo } = launchpad;


  useEffect(() => {
    if (response && response.code === "200") {
      refreshTableData.current();
      if (isOpenAddEditModal) toggleAddEditModal(!isOpenAddEditModal);
      toast.success(response.msg, {
        onOpen: () => {
          dispatch(clearResponse());
        },
      });
    } else if (response && response?.msg) {
      refreshTableData.current();
      toast.error(response.msg, {
        onOpen: () => {
          dispatch(clearResponse());
        },
      });
    }
  }, [dispatch, response]);


  useEffect(() => {          
    if (responseRemove && responseRemove.status === 200) {
        Swal.close();
        toast.success("Chain removed Successfully");
        refreshTableData.current();
    }
    else if (responseRemove?.message){
        Swal.close();
        toast.warning("Something went wrong. Try again");
       
    }
}, [responseRemove]);
  
 

  useEffect(() => {   
  if (responseAdd && responseAdd.status === 200) {
      Swal.close();
      refreshTableData.current();
      if (isOpenAddEditModal) toggleAddEditModal(!isOpenAddEditModal);
      toast.success("Chain Created Successfully");          
    }
    else if (responseAdd?.message){
        Swal.close();
        if (isOpenAddEditModal) toggleAddEditModal(!isOpenAddEditModal);
        toast.warning("Something went wrong. Please try again.");          
    }
  
  }, [responseAdd]);

  useEffect(() => {
    
    if (responseUpdate && responseUpdate.status === 200) {
    
      Swal.close();
      refreshTableData.current();
      if (isOpenAddEditModal) toggleAddEditModal(!isOpenAddEditModal);
      toast.success("Chain Updated Successfully");
      
    }
    else if (responseUpdate?.message){
        Swal.close();
        if (isOpenAddEditModal) toggleAddEditModal(!isOpenAddEditModal);
        toast.warning("Something went wrong. Please try again.");
    }
  
  },[responseUpdate]);


  const datatableOptions = {
    filterType: "dropdown",
    selectableRows: false,
    responsive: "standard",
    sort: true,
    filter: false,
    download: false,
  };

  const [details, handleFormData] = useState({
    active: true,
  });


  const [stageDetails, handleStageFormData] = useState([
    {
      stage: "",
      isExchangeList: false,
      presaleRate: "",
      listingRate: "",
      liquidity: "",
      softcap: "",
      hardcap: "",
      minimumBuy: "",
      maximumBuy: "",
      refundType: "",
      router: "",
      liquidityLockup: "",
      vesting: "",
      cliffing: "",
      totalDays: "",
      startDate: "",
      endDate: "",
      currencyRateDetails: [],
      active: false,
    },
  ]);


  const columns = () => [
    {
      name: "Name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (name) => {
          return (
            <>
              {name ? name : <div className="text-center">N/A</div>}
            </>
          )
        }
      },

    },
    {
      name: "Slug",
      label: "Slug",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (slug) => {
          return (
            <>
              {slug ? slug : <div className="text-center">-</div>}
            </>
          )
        }
      },

      // options: {
      //     filter: true,
      //     sort: false,
      // },
    },
    {
      name: "Symbol",
      label: "Symbol",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (symbol) => {
          return (
            <>{symbol ? symbol : <div className="text-center">-</div>}</>
          )
        }
      },

    },
    {
      name: "Bridge_Address",
      label: "Bridge Address",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (bridgeAddress) => {
          return (
            <>{bridgeAddress ? bridgeAddress : <div className="text-center">-</div>}</>
          )
        }
      },

    },
    {
      name: "Chain_ID",
      label: "Chain ID",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (chainID) => {
          return (
            <>{chainID ? chainID : <div className="text-center">-</div>}</>
          )
        }
      },

    },
    {
      name: "Active",
      label: "Active",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (active) => {
          return (
            <>{active == true ? <span className="badge bg-success rounded-pill">✔</span> : <span className="badge bg-danger rounded-pill">✖</span>}</>
          )
        }
      }, //?need to fix this

    },
    {
      label: "Actions",
      name: "action",
      options: {
        filter: false,
        sort: false,
        empty: true,
        download: false,
        display: hasPermission(["lyo delete network"], auth.currentUserRolePermissions),

        customBodyRender: (data) => {

          return (
            <div className="text-center">

              <button
                onClick={(e) => handleAddEditModal(data)}
                type="button"
                className="btn btn-soft-primary waves-effect waves-light my-4"
              >
                <i className="bx bx-edit-alt font-size-16 align-middle"></i>
              </button>
              &nbsp;
              <button
                onClick={(e) => removeItem(data.id)}
                type="button"
                disabled={data?.roles?.[0]?.name === "Administrator"}
                className="btn btn-soft-danger waves-effect waves-light"
              >
                <i className="bx bx-trash font-size-16 align-middle"></i>
              </button>
            </div>
          );
        },
      },
    },
  ];

  const removeItem = (id) => {
    if (!isEmpty(id)) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then((result) => {
        if (result.value) {
          Swal.fire({
            title: "Removing Chain",
            html: "Please wait...",
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          dispatch(removeChainLyo(id));

        }
      });
    }
  };

  let validationSchema = {
    bridgeAddress: Yup.string().required("Please enter bridge address."),
    name: Yup.string().required("Please enter valid name."),
    chainID: Yup.string().required("Please enter valid chain id."),

    childTokenAddress: Yup.string().required(
      "Please enter valid token address."
    ),
    imageUrl: Yup.string().required("Please enter valid image URL."),
    symbol: Yup.string().required("Please enter valid token symbol."),
    rpcUrl: Yup.string().required("Please enter valid rpc URL."),
    blockExplorerUrl: Yup.string().required("Please enter valid explorer URL."),

    wsUrl: Yup.string().required("Please enter ws URL."),
    active: Yup.string().required("Please select active."),
  };



  const useFormikOptions = {
    enableReinitialize: true,
    initialValues: {
      bridgeAddress:
        details && details.bridgeAddress ? details.bridgeAddress : "",
      name: details && details.name ? details.name : "",
      chainID: details && details.chainID ? details.chainID : "",

      childTokenAddress:
        details && details.childTokenAddress ? details.childTokenAddress : "",
      imageUrl: details && details.imageUrl ? details.imageUrl : "",
      symbol: details && details.symbol ? details.symbol : "",
      rpcUrl: details && details.rpcUrl ? details.rpcUrl : "",
      blockExplorerUrl:
        details && details.blockExplorerUrl ? details.blockExplorerUrl : "",

      wsUrl: details && details.wsUrl ? details.wsUrl : "",
      active: details && details.active ? details.active : "",
    },
    validationSchema: Yup.object(validationSchema),
    onSubmit: (values) => {

      const { ...restValue } = values;

      if (details._id) {
        dispatch(
          updateChainLyo({
            ...restValue,
            _id: details._id,

          })
        );
      } else {
        //!This try/catch for refresh table after new chain  
        dispatch(createChainLyo(values));


      }
    },
  };


  const validation = useFormik(useFormikOptions);




  const handleAddEditModal = (data = null) => {
    if (!isEmpty(data) && data?._id) {
      handleFormData({ ...data }); //,role: data.roles?.[0]?._id 
    } else {
      handleFormData({
        active: true,
      });
      validation.resetForm();
    }

    toggleAddEditModal(!isOpenAddEditModal);
  };




  const resultFormatter = (result) => {

    return result.docs.map((item) => {

      return {
        ...item,
        Name: item.name,
        Slug: item.slug,
        Symbol: item.symbol,
        Bridge_Address: item.bridgeAddress,
        Chain_ID: item.chainID,
        Active: item.active,

        action: item,


      };
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Helmet>
          <title>Chain Details | LFi</title>
        </Helmet>

        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Bridge" breadcrumbItem="Chains" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="px-0">
                  <div className="table-responsive">
                    {/* need to create permissions for chains */}
                    <HasAnyPermission permission={["lyo bridge admin", "lyo bridge networks list"]}>
                      <ReactDataTable
                        //   url={`${apiChainsUrl}/chains`}
                        url={`${apiBridgeUrlLYO}/chains`}
                        columns={columns()}
                        resultFormatter={resultFormatter}
                        setRefresh={refreshTableData}
                        disableFilterIcon={false}
                        disableSearchIcon={false}
                        origin={
                          <div className="row">
                            <div className="col-auto h4">
                              Chains &nbsp;
                              <HasAnyPermission
                                permission={["lyo bridge admin", "lyo bridge networks list"]}
                              >
                                <button
                                  onClick={() => {
                                    handleAddEditModal();
                                  }}
                                  type="button"
                                  className="btn btn-primary waves-effect waves-light"
                                >
                                  <i className="bx bx-plus-medical font-size-16 align-middle"></i>
                                </button>
                              </HasAnyPermission>
                            </div>
                          </div>
                        }
                        rowsPerPage={10}
                      />
                    </HasAnyPermission>

                    <Modal
                      isOpen={isOpenAddEditModal}
                      toggle={handleAddEditModal}
                      backdrop={"static"}
                      size="lg"
                      centered={true}
                    >
                      <ModalHeader toggle={handleAddEditModal} tag="h4">
                        {details?._id ? "Edit" : "Add Chain"}
                      </ModalHeader>

                      <ModalBody>
                        {/* need to create this func disabled={!couldHaveAddUpdatePermission()} */}

                        <Form
                          // form={true}
                          // onSubmit={
                          // 	validation.handleSubmit
                          // }
                          disabled
                          onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                          }}
                        >
                          <fieldset>
                            <Row form={"true"}>
                              <Col xs={12}>
                                <div className="mb-3">
                                  <Label className="form-label">
                                    Bridge Address
                                  </Label>
                                  <Input
                                    name="bridgeAddress"
                                    type="text"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values.bridgeAddress ||
                                      ""
                                    }
                                    invalid={
                                      validation.touched.bridgeAddress &&
                                        validation.errors.bridgeAddress
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.bridgeAddress &&
                                    validation.errors.bridgeAddress ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.bridgeAddress}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>



                              <Col xs={12}>
                                <div className="mb-3">
                                  <Label className="form-label">
                                    Active
                                  </Label>
                                  <Input
                                    name="active"
                                    type="select"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.active}
                                    invalid={
                                      validation.touched.active &&
                                        validation.errors.active
                                        ? true
                                        : false
                                    }
                                  >
                                    <option value="">
                                      Select an option
                                    </option>
                                    <option value="true">True</option>
                                    <option value="false">
                                      False
                                    </option>
                                  </Input>
                                  {validation.touched.active &&
                                    validation.errors.active ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.active}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>

                              {/* {details._id === undefined ? (
                                      need to verify this part
                                      <> */}


                              <Col xs={12}>
                                <div className="mb-3">
                                  <Label className="form-label">
                                    Name
                                  </Label>
                                  <Input
                                    name="name"
                                    type="text"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.name || ""}
                                    invalid={
                                      validation.touched.name &&
                                        validation.errors.name
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.name &&
                                    validation.errors.name ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.name}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>

                              <Col xs={12}>
                                <div className="mb-3">
                                  <Label className="form-label">
                                    Chain ID
                                  </Label>
                                  <Input
                                    name="chainID"
                                    type="number"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values.chainID || ""
                                    }
                                    invalid={
                                      validation.touched.chainID &&
                                        validation.errors.chainID
                                        ? true
                                        : false
                                    }
                                  ></Input>

                                  {validation.touched.chainID &&
                                    validation.errors.chainID ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.chainID}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>

                              <Col xs={12}>
                                <div className="mb-3">
                                  <Label className="form-label">
                                    Child Token Address
                                  </Label>
                                  <Input
                                    name="childTokenAddress"
                                    type="text"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values
                                        .childTokenAddress || ""
                                    }
                                    invalid={
                                      validation.touched
                                        .childTokenAddress &&
                                        validation.errors.childTokenAddress
                                        ? true
                                        : false
                                    }
                                  ></Input>

                                  {validation.touched.childTokenAddress &&
                                    validation.errors.childTokenAddress ? (
                                    <FormFeedback type="invalid">
                                      {
                                        validation.errors
                                          .childTokenAddress
                                      }
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>

                              <Col xs={12}>
                                <div className="mb-3">
                                  <Label className="form-label">
                                    Image URL
                                  </Label>
                                  <Input
                                    name="imageUrl"
                                    type="text"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values.imageUrl || ""
                                    }
                                    invalid={
                                      validation.touched.imageUrl &&
                                        validation.errors.imageUrl
                                        ? true
                                        : false
                                    }
                                  ></Input>

                                  {validation.touched.imageUrl &&
                                    validation.errors.imageUrl ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.imageUrl}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>

                              <Col xs={12}>
                                <div className="mb-3">
                                  <Label className="form-label">
                                    Symbol{" "}
                                  </Label>
                                  <Input
                                    name="symbol"
                                    type="text"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.symbol || ""}
                                    invalid={
                                      validation.touched.symbol &&
                                        validation.errors.symbol
                                        ? true
                                        : false
                                    }
                                  ></Input>

                                  {validation.touched.symbol &&
                                    validation.errors.symbol ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.symbol}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>

                              <Col xs={12}>
                                <div className="mb-3">
                                  <Label className="form-label">
                                    Rpc URL{" "}
                                  </Label>
                                  <Input
                                    name="rpcUrl"
                                    type="text"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.rpcUrl || ""}
                                    invalid={
                                      validation.touched.rpcUrl &&
                                        validation.errors.rpcUrl
                                        ? true
                                        : false
                                    }
                                  ></Input>

                                  {validation.touched.rpcUrl &&
                                    validation.errors.rpcUrl ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.rpcUrl}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>

                              <Col xs={12}>
                                <div className="mb-3">
                                  <Label className="form-label">
                                    BlockExplorer URL{" "}
                                  </Label>
                                  <Input
                                    name="blockExplorerUrl"
                                    type="text"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values
                                        .blockExplorerUrl || ""
                                    }
                                    invalid={
                                      validation.touched
                                        .blockExplorerUrl &&
                                        validation.errors.blockExplorerUrl
                                        ? true
                                        : false
                                    }
                                  ></Input>

                                  {validation.touched.blockExplorerUrl &&
                                    validation.errors.blockExplorerUrl ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.blockExplorerUrl}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>

                              <Col xs={12}>
                                <div className="mb-3">
                                  <Label className="form-label">
                                    WS URL
                                  </Label>
                                  <Input
                                    name="wsUrl"
                                    type="text"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                      validation.values.wsUrl || ""
                                    }
                                    invalid={
                                      validation.touched.wsUrl &&
                                        validation.errors.wsUrl
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.wsUrl &&
                                    validation.errors.wsUrl ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.wsUrl}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>

                              {/* 
                                      </>
                                    ) : null} */}
                            </Row>
                            <Row>
                              <Col>
                                <div className="text-end mt-3">
                                  <button
                                    type="submit"
                                    className="btn btn-success save-user"
                                  >
                                    Save
                                  </button>
                                </div>
                              </Col>
                            </Row>
                          </fieldset>
                        </Form>
                      </ModalBody>
                    </Modal>
                  </div>
                </CardBody>
              </Card>

            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default LyoChains;
