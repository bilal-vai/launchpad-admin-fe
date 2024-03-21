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
import { apiBridgeUrlLFI, apiUrl } from "../../config";
import Swal from "sweetalert2";
import classnames from "classnames";
import { Link } from "react-router-dom";
import {
  createChain,
  updateChain,
  removeChain,
  getAllChains,
} from "../../store/bridge/actions";
import TokenDetailsModal from "./TokenDetailsModal";

const Chains = (props) => {
  const dispatch = useDispatch();
  const refreshTableData = useRef(null);
  const { chainsResponse, responseAdd, responseRemove, responseUpdate } =
    useSelector((state) => ({
      chainsResponse: state.bridge.chainsResponse,
      responseAdd: state.bridge.responseAdd,
      responseRemove: state.bridge.responseRemove,
      responseUpdate: state.bridge.responseUpdate,
    }));



  const [chainData, setChainData] = useState();
  const [tokenInfoIndex, setTokenInfoIndex] = useState(0);
  const [activeTabFormStep, setActiveTabFormStep] = useState(1);
  const [isOpenAddEditModal, toggleAddEditModal] = useState(false);
  const [isOpenAddEditNewModal, toggleAddEditNewModal] = useState(false);
  const { auth, launchpad } = useSelector((state) => ({
    auth: state.auth,
    launchpad: state.launchpad,
  }));

  const [tokenDetails, handleTokenFormData] = useState([
    {
      symbol: "",
      bridgeAddress: "",
 
      address: "",
      gatewayAddress: "",
    },
  ]);

  const [tokenInfoModalDetails, toggleTokenInfoModal] = useState({
    active: false,
    action: "add",
    isDirectInsert: false,
  });

  const handleAddNewToken = (isDirectInsert = false) => {
    if (tokenDetails[0]?.symbol) {
      setTokenInfoIndex(tokenDetails.length);
    }
    toggleTokenInfoModal({
      action: "add",
      active: true,
      isDirectInsert: isDirectInsert,
    });
    validationForTokenInfoStep.resetForm();
  };

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

      Object.keys(responseRemove).forEach((item) => {
        responseRemove[item] = undefined;
      });
      refreshTableData.current();
    } else if (responseRemove?.message) {
      Swal.close();
      toast.warning("Something went wrong. Try again");
      Object.keys(responseRemove).forEach((item) => {
        responseRemove[item] = undefined;
      });
    } else if (responseRemove.status == undefined) {
      return;
    }
  }, [responseRemove]);

  useEffect(() => {
    if (responseAdd && responseAdd.status === 200) {
      Swal.close();
      refreshTableData.current();
      if (isOpenAddEditModal) toggleAddEditModal(!isOpenAddEditModal);
      Object.keys(responseAdd).forEach((item) => {
        responseAdd[item] = undefined;
      });

      toast.success("Chain Created Successfully");
    } else if (responseAdd?.message) {
      Swal.close();
      if (isOpenAddEditModal) toggleAddEditModal(!isOpenAddEditModal);
      toast.warning("Something went wrong. Please try again.");
      Object.keys(responseAdd).forEach((item) => {
        responseAdd[item] = undefined;
      });
    } else if (responseAdd.status == undefined) {
      return;
    }
  }, [responseAdd]);

  useEffect(() => {
    if (responseUpdate && responseUpdate.status === 200) {
      Swal.close();
      refreshTableData.current();
      if (isOpenAddEditModal) toggleAddEditModal(!isOpenAddEditModal);
      toast.success("Chain Updated Successfully");
      Object.keys(responseUpdate).forEach((item) => {
        responseUpdate[item] = undefined;
      });
    } else if (responseUpdate?.message) {
      Swal.close();
      if (isOpenAddEditModal) toggleAddEditModal(!isOpenAddEditModal);
      toast.warning("Something went wrong. Please try again.");
      Object.keys(responseUpdate).forEach((item) => {
        responseUpdate[item] = undefined;
      });
    } else if (responseUpdate.status == undefined) {
      return;
    }
  }, [responseUpdate]);

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

  const columns = () => [
    {
      name: "Name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (name) => {
          return <>{name ? name : <div className="text-center">N/A</div>}</>;
        },
      },
    },
    {
      name: "Slug",
      label: "Slug",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (slug) => {
          return <>{slug ? slug : <div className="text-center">-</div>}</>;
        },
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
          return <>{symbol ? symbol : <div className="text-center">-</div>}</>;
        },
      },
    },

    {
      name: "tokens",
      label: "Token Details",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (item) => {
          return item.tokens?.map((token, index) => {
            return (
              <React.Fragment key={index}>
                <div className="pb-4">
                  <div className="d-flex gap-4 justify-content-between mb-1 text-nowrap">
                    <p>
                      <strong className="text-nowrap">{token.symbol}</strong>
                    </p>
                  </div>
                  <div className="d-flex gap-4 justify-content-between mb-1 text-nowrap">
                    <span>Token Address: </span>
                    <span className="text-nowrap">{token.address}</span>
                  </div>
                  <div className="d-flex gap-4 justify-content-between mb-1 text-nowrap">
                    <span>Bridge Address: </span>
                    <span className="text-nowrap">{token.bridgeAddress}</span>
                  </div>
                  <div className="d-flex gap-4 justify-content-between mb-1 text-nowrap">
                    <span>Gateway Address: </span>
                    <span className="text-nowrap">{token.gatewayAddress}</span>
                  </div>
                </div>
              </React.Fragment>
            );
          });
        },
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
          );
        },
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
            <>
              {active == true ? (
                <span className="badge bg-success rounded-pill">✔</span>
              ) : (
                <span className="badge bg-danger rounded-pill">✖</span>
              )}
            </>
          );
        },
      },
    },
    {
      label: "Actions",
      name: "action",
      options: {
        filter: false,
        sort: false,
        empty: true,
        download: false,
        display: hasPermission(
          ["delete network"],
          auth.currentUserRolePermissions
        ),

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
            title: "Removing",
            html: "Please wait...",
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          dispatch(removeChain(id));
        }
      });
    }
  };

  let validationSchema = {
    name: Yup.string().required("Please enter valid name."),
    chainID: Yup.string().required("Please enter valid chain id."),


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
      name: details && details.name ? details.name : "",
      chainID: details && details.chainID ? details.chainID : "",


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

      const formData = {
        ...restValue,
        tokens: tokenDetails,
      };     



      if(tokenDetails && tokenDetails[0]?.symbol){

      if (details._id) {
        dispatch(
          updateChain({
              ...formData,
            _id: details._id,
          })
        );
      } else {
        dispatch(createChain(formData));
      }
    } else{
      toast.error("Please add token details");    
    }
    
  },
};

  const validation = useFormik(useFormikOptions);

 



  const handleAddEditModal = (data = null) => {
    if (!isEmpty(data) && data?._id) {
      handleFormData({ ...data }); //,role: data.roles?.[0]?._id 
      handleTokenFormData(data.tokens ?? [{ active: false }]);     
    } else {
      handleFormData({
        active: true,
      });
      handleTokenFormData([			
          {
            symbol: "",
            address: "",
            bridgeAddress: "",
            gatewayAddress: ""
          },				
			]);
      validation.resetForm();
    }
    

    toggleAddEditModal(!isOpenAddEditModal);
  };
  

  const handleEditToken = (index) => {
    setTokenInfoIndex(index);
    toggleTokenInfoModal({ action: "edit", active: true });
  };

  const handleDeleteTokenInfo = (index) => {
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

        tokenDetails.splice(index, 1);
        handleTokenFormData([...tokenDetails]);
      }
    });
  };

  const resultFormatter = (result) => {
    return result.docs.map((item) => {
      return {
        ...item,
        Name: item.name,
        Slug: item.slug,
        Symbol: item.symbol,
        tokens: item,
 
        Chain_ID: item.chainID,
        Active: item.active,

        action: item,
      };
    });
  };

  const useFormikOptionsForTokenInfoStep = {
    enableReinitialize: true,
    initialValues: {
      symbol: tokenDetails[tokenInfoIndex]?.symbol
        ? tokenDetails[tokenInfoIndex].symbol
        : "",
      address: tokenDetails[tokenInfoIndex]?.address
        ? tokenDetails[tokenInfoIndex].address
        : "",
      bridgeAddress: tokenDetails[tokenInfoIndex]?.bridgeAddress
        ? tokenDetails[tokenInfoIndex].bridgeAddress
        : "",
      gatewayAddress: tokenDetails[tokenInfoIndex]?.gatewayAddress
        ? tokenDetails[tokenInfoIndex].gatewayAddress
        : "",
    },
    validationSchema: Yup.object({
      symbol: Yup.string().required("Please enter Token symbol."),
      address: Yup.string().required("Please enter Token Address."),
      bridgeAddress: Yup.string().required("Please enter Bridge Address."),
      gatewayAddress: Yup.string().required("Please enter Gateway Address."),   
        }),
    onSubmit: (values) => {     
     
      if (tokenDetails?.[tokenInfoIndex]) {
     
       
        tokenDetails[tokenInfoIndex] = {
          ...tokenDetails[tokenInfoIndex],
          ...values,
          active: true,
        };

        handleTokenFormData([...tokenDetails]);
        toast.success("Token updated successfully.");        
      } else {
        handleTokenFormData([
          ...tokenDetails,
          {
            ...values,
            active: true,
          },
        ]);
        toast.success("Token add successfully.");        
      }

      toggleTokenInfoModal({ ...tokenInfoModalDetails, active: false });
    },
  };

  const validationForTokenInfoStep = useFormik(
    useFormikOptionsForTokenInfoStep
  );

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
                    <HasAnyPermission
                      permission={["bridge admin", "bridge networks list"]}
                    >
                      <ReactDataTable
                        //   url={`${apiChainsUrl}/chains`}
                        url={`${apiBridgeUrlLFI}/chains`}
                        columns={columns()}
                        resultFormatter={resultFormatter}
                        setRefresh={refreshTableData}
                        disableFilterIcon={true}
                        disableSearchIcon={true}
                        download={false}
                        origin={
                          <div className="row">
                            <div className="col-auto h4">
                              Chains &nbsp;
                              <HasAnyPermission
                                permission={[
                                  "bridge admin",
                                  "bridge networks list",
                                ]}
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
                      <ModalHeader                        
                        toggle={handleAddEditModal}
                        tag="h4"
                      >
                        {details?._id ? "Edit" : "Add Chain"}
                      </ModalHeader>

                      <ModalBody>
                        <Form
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
                                  <Label className="form-label">Active</Label>
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
                                    <option value="">Select an option</option>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                  </Input>
                                  {validation.touched.active &&
                                  validation.errors.active ? (
                                    <FormFeedback type="invalid">
                                      {validation.errors.active}
                                    </FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                              {/* 
                                    {details._id === undefined ? (
                                      
                                      <>
                                      </>
                                      ) : null} */}

                              <Col xs={12}>
                                <div className="mb-3">
                                  <Label className="form-label">Name</Label>
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
                                  <Label className="form-label">Chain ID</Label>
                                  <Input
                                    name="chainID"
                                    type="number"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.chainID || ""}
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
                                    Image URL
                                  </Label>
                                  <Input
                                    name="imageUrl"
                                    type="text"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.imageUrl || ""}
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
                                  <Label className="form-label">Symbol </Label>
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
                                  <Label className="form-label">Rpc URL </Label>
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
                                      validation.values.blockExplorerUrl || ""
                                    }
                                    invalid={
                                      validation.touched.blockExplorerUrl &&
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
                                  <Label className="form-label">WS URL</Label>
                                  <Input
                                    name="wsUrl"
                                    type="text"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.wsUrl || ""}
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

                              <div className="d-flex flex-wrap align-items-center mb-4">
                                <h5 className="card-title me-2">{"Tokens"}</h5>
                                <button
                                  type="button"
                                  className="btn btn-soft-primary waves-effect waves-light"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleAddNewToken();
                                  }}
                                >
                                  <i className="bx bx-plus font-size-16 align-middle"></i>
                                </button>
                              </div>


                              <Card>
                                <CardBody>
                                  <div>
                                    <Row>
                                      <Col xs={12}>
                                        {tokenDetails[0]?.symbol ?  (
                                          <div className="row">
                                            {tokenDetails.map(
                                              (token, tokenInfoId) => (
                                                <div
                                                  className="teamInfoStage col-lg-12"
                                                  key={tokenInfoId}
                                                // style={{
                                                // 	width: "100%",
                                                // 	height: "100%",
                                                // }}
                                                >
                                                  <Card className="m-1">
                                                    <div className="card-header align-items-center d-flex">
                                                      <h4 className="card-title mb-0 flex-grow-1">
                                                      {token.symbol}
                                                      </h4>
                                                    </div>
                                                    <CardBody>
                                                      <div className="mt-0">
                                                        <div className="d-flex align-items-center">
                                                          <div className="flex-grow-1">
                                                            <span className="font-size-12">
                                                              Symbol
                                                            </span>
                                                          </div>
  
                                                          <div className="flex-shrink-0">
                                                            <span className="font-size-12 fw-medium">
                                                              {
                                                                token.symbol
                                                              }
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="mt-0">
                                                        <div className="d-flex align-items-center">
                                                          <div className="flex-grow-1">
                                                            <span className="font-size-12">
                                                              Token Address
                                                            </span>
                                                          </div>
  
                                                          <div className="flex-shrink-0">
                                                            <span className="font-size-12 fw-medium">
                                                              {
                                                                token.address
                                                              }
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="mt-0">
                                                        <div className="d-flex align-items-center">
                                                          <div className="flex-grow-1">
                                                            <span className="font-size-12">
                                                              Bridge Address
                                                            </span>
                                                          </div>
  
                                                          <div className="flex-shrink-0">
                                                            <span className="breakWord font-size-12 fw-medium">
                                                              {
                                                                token.bridgeAddress
                                                              }
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div className="mt-0">
                                                        <div className="d-flex align-items-center">
                                                          <div className="flex-grow-1">
                                                            <span className="font-size-12">
                                                              Gateway Address
                                                            </span>
                                                          </div>
  
                                                          <div className="flex-shrink-0">
                                                            <span className="breakWord font-size-12 fw-medium">
                                                              {
                                                                token.gatewayAddress
                                                              }
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </CardBody>
                                                    <div className="actionBtn">
                                                      <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1">
                                                          <span className="font-size-16">
                                                            <button
                                                              type="button"
                                                              className="btn btn-soft-danger waves-effect waves-light"
                                                              onClick={(
                                                                e
                                                              ) => {
                                                                e.preventDefault();
                                                                handleDeleteTokenInfo(
                                                                  tokenInfoId
                                                                );
                                                              }}
                                                            >
                                                              <i className="mdi mdi-trash-can d-block font-size-16 align-middle"></i>
                                                            </button>
                                                          </span>
                                                        </div>
  
                                                        <div className="flex-shrink-0">
                                                          <button
                                                            type="button"
                                                            className="btn btn-soft-success waves-effect waves-light"
                                                            onClick={(
                                                              e
                                                            ) => {
                                                              e.preventDefault();
                                                              handleEditToken(
                                                                tokenInfoId
                                                              );
                                                            }}
                                                          >
                                                            <i className="mdi mdi-pencil d-block font-size-16 align-middle"></i>
                                                          </button>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </Card>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        ) : (
                                          <div className="text-center ">
                                            <span className="text-center text-muted">{`No Tokens`}</span>
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                  </div>
                                </CardBody>
                                </Card>

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
                    <TokenDetailsModal
            tokenInfoModalDetails={tokenInfoModalDetails}
            toggleTokenInfoModal={toggleTokenInfoModal}
            validationForTokenInfoStep={validationForTokenInfoStep}

          />

                    
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

export default Chains;
