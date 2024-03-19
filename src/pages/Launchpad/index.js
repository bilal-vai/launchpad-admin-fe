import React, { useEffect, useState, useRef, useMemo } from "react";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Helmet } from "react-helmet";
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
	TabContent,
	TabPane,
	NavLink,
	FormGroup,
	InputGroup,
	CardHeader,
} from "reactstrap";
import { Link } from "react-router-dom";

import classnames from "classnames";
import * as Yup from "yup";
import { useFormik } from "formik";
//redux
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";
import ReactDataTable from "../../common/ReactDataTable";
import isEmpty from "../../utils/isEmpty";
import yupValidImageSrc from "../../utils/yupValidImageSrc";
import { apiUrl } from "../../config";
import {
	create,
	update,
	remove,
	toggle,
	clearResponse,
	getLaunchpadOptions,
} from "../../store/launchpad/actions";
import Swal from "sweetalert2";
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const Launchpad = (props) => {
	const dispatch = useDispatch();
	const refreshTableData = useRef(null);
	const { response, auth, launchpad } = useSelector((state) => ({
		response: state.launchpad.response,
		auth: state.auth,
		launchpad: state.launchpad,
	}));

	const [isOpenAddEditModal, toggleAddEditModal] = useState(false);
	const [activeTabFormStep, setActiveTabFormStep] = useState(1);
	const [currencyFeeOptions, setCurrencyFeeOptions] = useState([]);

	const [details, handleformData] = useState({
		tokenAddress: "",
		tokenName: "",
		tokenSymbol: "",
		tokenDecimal: "",
		currency: "",
		feeOption: "",
		listingOption: "",
		presaleRate: "",
		whiteList: "",
		softcap: "",
		hardcap: "",
		minimumBuy: "",
		maximumBuy: "",
		refundType: "",
		router: "",
		liquidity: "",
		listingRate: "",
		liquidityLockup: "",
		startDate: "",
		endDate: "",
		description: "",
		additionalInfo: {},
	});

	const [launchpadOptions, setLaunchpadOption] = useState({});

	useEffect(() => {
		dispatch(getLaunchpadOptions());
	}, [dispatch]);

	useEffect(() => {
		const options = {};
		launchpad.launchpadOptions.forEach((launchpadOption, index) => {
			options[launchpadOption.type] = launchpadOption;
			if (launchpadOption.type === "currency") {
				handleformData({
					...details,
					currency: launchpadOption.data[0].name,
					feeOption: launchpadOption.data[0].feeOption[0],
				});
				setCurrencyFeeOptions(launchpadOption.data[0].feeOption);
				validationForFirstStep.setFieldValue(
					"currency",
					launchpadOption.data[0].name
				);
				validationForFirstStep.setFieldValue(
					"feeOption",
					launchpadOption.data[0].feeOption[0]
				);
			}
		});
		setLaunchpadOption(options);
	}, [launchpad.launchpadOptions]);

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

	const toggleTab = async (tab, previous = false) => {
		if (activeTabFormStep !== tab) {
			if (previous) setActiveTabFormStep(tab);
			else {
				if (tab >= 1 && tab <= 4) {
					if (tab === 2) {
						const result =
							await validationForFirstStep.validateForm();
						if (isEmpty(result)) {
							setActiveTabFormStep(tab);
						} else {
							validationForFirstStep.handleSubmit();
						}
					} else if (tab === 3) {
						const result =
							await validationForSecondStep.validateForm();
						if (isEmpty(result)) {
							setActiveTabFormStep(tab);
						} else {
							validationForSecondStep.handleSubmit();
						}
					} else if (tab === 4) {
						const result =
							await validationForThirdStep.validateForm();
						if (isEmpty(result)) {
							setActiveTabFormStep(tab);
						} else {
							validationForThirdStep.handleSubmit();
						}
					} else {
						setActiveTabFormStep(tab);
					}
				}
			}
		}
	};

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
					dispatch(remove(id));
				}
			});
		}
	};

	const toggleItem = (id) => {
		if (!isEmpty(id)) {
			dispatch(toggle(id));
		}
	};

	const useFormikOptionsForFirstStep = {
		enableReinitialize: true,
		initialValues: {
			tokenAddress:
				details && details.tokenAddress ? details.tokenAddress : "",
			tokenName: details && details.tokenName ? details.tokenName : "",
			tokenSymbol:
				details && details.tokenSymbol ? details.tokenSymbol : "",
			tokenDecimal:
				details && details.tokenDecimal ? details.tokenDecimal : "",
			currency: details && details.currency ? details.currency : "",
			feeOption:
				details && details.feeOption ? details.feeOption.fee : "",
			// feeOption:
			// 	details && details.feeOption
			// 		? details.feeOption
			// 		: {
			// 				fee: "",
			// 				description: "",
			// 		  },
			listingOption:
				details && details.listingOption ? details.listingOption : "",
		},
		validationSchema: Yup.object({
			tokenAddress: Yup.string().required(),
			feeOption: Yup.string().required(),
			currency: Yup.string().required(),
		}),
		onSubmit: (values) => {},
	};

	const validationForFirstStep = useFormik(useFormikOptionsForFirstStep);

	const useFormikOptionsForSecondStep = {
		enableReinitialize: true,
		initialValues: {
			presaleRate:
				details && details.presaleRate ? details.presaleRate : "",
			whiteList: details && details.currency ? details.currency : "",
			softcap: details && details.whiteList ? details.whiteList : "",
			hardcap: details && details.hardcap ? details.hardcap : "",
			minimumBuy: details && details.minimumBuy ? details.minimumBuy : "",
			maximumBuy: details && details.maximumBuy ? details.maximumBuy : "",
			refundType: details && details.refundType ? details.refundType : "",
			router: details && details.router ? details.router : "",
			liquidity: details && details.liquidity ? details.liquidity : "",
			listingRate:
				details && details.listingRate ? details.listingRate : "",
			liquidityLockup:
				details && details.liquidityLockup
					? details.liquidityLockup
					: "",
			startDate: details && details.startDate ? details.startDate : "",
			endDate: details && details.endDate ? details.endDate : "",
		},
		validationSchema: Yup.object({
			presaleRate: Yup.string().required(),
			softcap: Yup.string().required(),
			hardcap: Yup.string().required(),
			minimumBuy: Yup.string().required(),
			maximumBuy: Yup.string().required(),
			refundType: Yup.string().required(),
			liquidity: Yup.string().required(),
			listingRate: Yup.string().required(),
			liquidityLockup: Yup.string().required(),
			router: Yup.string().required(),
			startDate: Yup.date().required(),
			endDate: Yup.date().required(),
		}),
		onSubmit: (values) => {},
	};

	const validationForSecondStep = useFormik(useFormikOptionsForSecondStep);

	const useFormikOptionsForThirdStep = {
		enableReinitialize: true,
		initialValues: {
			logoURL: details.additionalInfo?.logoURL
				? details.additionalInfo.logoURL
				: "",
			websiteURL: details.additionalInfo?.websiteURL
				? details.additionalInfo.websiteURL
				: "",
			facebook: details.additionalInfo?.facebook
				? details.additionalInfo.facebook
				: "",
			twitter: details.additionalInfo?.twitter
				? details.additionalInfo.twitter
				: "",
			github: details.additionalInfo?.github
				? details.additionalInfo.github
				: "",
			telegram: details.additionalInfo?.telegram
				? details.additionalInfo.telegram
				: "",
			instagram: details.additionalInfo?.instagram
				? details.additionalInfo.instagram
				: "",
			reddit: details.additionalInfo?.reddit
				? details.additionalInfo.reddit
				: "",
			discord: details.additionalInfo?.discord
				? details.additionalInfo.discord
				: "",
			linkedin: details.additionalInfo?.linkedin
				? details.additionalInfo.linkedin
				: "",
			description: details.description ? details.description : "",
		},
		validationSchema: Yup.object({
			logoURL: Yup.string().test(
				"valid-image-url",
				"Must use valid image URL",
				(value) =>
					yupValidImageSrc(value, 1000).then(
						(status) => status === "success"
					)
			),
			websiteURL: Yup.string().required(),
		}),
		onSubmit: (values) => {},
	};

	const validationForThirdStep = useFormik(useFormikOptionsForThirdStep);

	const handleChangeCurrency = (feeOption) => {
		setCurrencyFeeOptions(feeOption);
		validationForFirstStep.setFieldValue("feeOption", feeOption[0].fee);
	};

	const handleDateChange = (name, date) => {
		validationForSecondStep.setFieldValue(name, date);
	};

	const handleAddEditModal = (data = null) => {
		setActiveTabFormStep(1);
		validationForFirstStep.resetForm();
		validationForSecondStep.resetForm();
		validationForThirdStep.resetForm();
		if (!isEmpty(data) && data?._id) {
			handleformData(data);
		} else {
			handleformData({
				tokenAddress: "",
				tokenName: "",
				tokenSymbol: "",
				tokenDecimal: "",
				currency: "",
				feeOption: "",
				listingOption: "",
				presaleRate: "",
				whiteList: "",
				softcap: "",
				hardcap: "",
				minimumBuy: "",
				maximumBuy: "",
				refundType: "",
				router: "",
				liquidity: "",
				listingRate: "",
				liquidityLockup: "",
				startDate: "",
				endDate: "",
				description: "",
				additionalInfo: {},
			});
		}
		toggleAddEditModal(!isOpenAddEditModal);
	};

	const handleFinalFormSubmit = () => {
		let feeOption = {};
		if (validationForFirstStep.values.feeOption) {
			feeOption = currencyFeeOptions.find(
				(feeOp) =>
					parseInt(feeOp.fee) ===
					parseInt(validationForFirstStep.values.feeOption)
			);
		}
		const formatData = {
			...details,
			...validationForFirstStep.values,
			feeOption: feeOption,
			...validationForSecondStep.values,
			additionalInfo: validationForThirdStep.values,
		};
		if (details._id) {
			dispatch(update(formatData));
		} else {
			dispatch(create(formatData));
		}
	};

	const columns = () => [
		{
			label: "Currency",
			name: "currency",
			options: {
				filter: true,
				sort: false,
			},
		},

		{
			label: "Token Address",
			name: "tokenAddress",
			options: {
				filter: true,
				sort: false,
			},
		},

		{
			label: "Liquidity",
			name: "liquidity",
			options: {
				filter: true,
				sort: false,
			},
		},

		{
			label: "Liquidity Lockup(days)",
			name: "liquidityLockup",
			options: {
				filter: true,
				sort: false,
			},
		},

		// {
		// 	name: "active",
		// 	label: "Active",
		// 	options: {
		// 		filter: false,
		// 		sort: false,
		// 		download: false,
		// 		customBodyRender: (rowData) => (
		// 			<div className="square-switch">
		// 				<Input
		// 					type="checkbox"
		// 					id={`square-switch-${rowData._id}-banner`}
		// 					switch="none"
		// 					checked={rowData.active}
		// 					onClick={() => {
		// 						toggleItem(rowData._id);
		// 					}}
		// 					onChange={() => {
		// 						toggleItem(rowData._id);
		// 					}}
		// 				/>
		// 				<Label
		// 					htmlFor={`square-switch-${rowData._id}-banner`}
		// 					data-on-label="Yes"
		// 					data-off-label="No"
		// 				></Label>
		// 			</div>
		// 		),
		// 	},
		// },

		{
			label: "Actions",
			name: "action",
			options: {
				filter: false,
				sort: false,
				empty: true,
				download: false,
				display: hasPermission(
					["launchpad update", "launchpad delete", "launchpad view"],
					auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					["launchpad update", "launchpad delete", "launchpad view"],
					auth.currentUserRolePermissions
				),
				customBodyRender: (data) => {
					return (
						<div className="text-center">
							<HasAnyPermission
								permission={[
									"launchpad update",
									"launchpad view",
								]}
							>
								<button
									onClick={(e) => handleAddEditModal(data)}
									type="button"
									className="btn btn-soft-primary waves-effect waves-light"
								>
									<i className="bx bx-edit-alt font-size-16 align-middle"></i>
								</button>
							</HasAnyPermission>
							&nbsp;
							<HasAnyPermission permission={["launchpad delete"]}>
								<button
									onClick={(e) => removeItem(data._id)}
									type="button"
									className="btn btn-soft-danger waves-effect waves-light"
								>
									<i className="bx bx-trash font-size-16 align-middle"></i>
								</button>
							</HasAnyPermission>
						</div>
					);
				},
			},
		},
	];

	const resultFormatter = (result) => {
		return result.docs.map((item) => {
			return {
				...item,
				active: item,
				action: item,
			};
		});
	};

	const couldHaveAddUpdatePermission = () => {
		const isUpdatePermission = hasPermission(
			["launchpad update"],
			auth.currentUserRolePermissions
		);
		const isAddPermission = hasPermission(
			["launchpad add"],
			auth.currentUserRolePermissions
		);
		if (isUpdatePermission && isAddPermission) return true;
		else if (isUpdatePermission && !isEmpty(details._id)) return true;
		else if (isAddPermission && isEmpty(details._id)) return true;
		else return false;
	};

	return (
		<React.Fragment>
			<div className="page-content">
				<Helmet>
					<title>Launchpad | LFinance</title>
				</Helmet>
				<Container fluid>
					{/* Render Breadcrumbs */}
					<Breadcrumbs
						title="Launchpad Option"
						breadcrumbItem="List"
					/>
					<Row>
						<Col lg="12">
							<Card>
								<CardBody>
									<Row>
										<Col xl="12">
											<div className="table-rep-plugin">
												<div className="table-responsive">
													<HasAnyPermission
														permission={[
															"launchpad list",
														]}
													>
														<ReactDataTable
															url={`${apiUrl}/admin/launchpad/pagination`}
															columns={columns()}
															resultFormatter={
																resultFormatter
															}
															setRefresh={
																refreshTableData
															}
															disableFilterIcon={
																true
															}
															disableSearchIcon={
																true
															}
															origin={
																<div className="row">
																	<div className="col-auto h4">
																		Launchpad
																		&nbsp;
																		<HasAnyPermission
																			permission={[
																				"launchpad add",
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
														isOpen={
															isOpenAddEditModal
														}
														// toggle={
														// 	handleAddEditModal
														// }
														size="xl"
														centered={true}
													>
														<ModalHeader
															toggle={
																handleAddEditModal
															}
															tag="h4"
														>
															{details?._id
																? "Edit Launchpad"
																: "Add Launchpad"}
														</ModalHeader>
														<ModalBody>
															<fieldset
																disabled={
																	!couldHaveAddUpdatePermission()
																}
															>
																<div
																	id="basic-pills-wizard"
																	className="twitter-bs-wizard"
																>
																	<ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
																		<NavItem>
																			<NavLink
																				href="#"
																				className={classnames(
																					{
																						active:
																							activeTabFormStep ===
																							1,
																					}
																				)}
																				// onClick={() => {
																				// 	setActiveTabFormStep(
																				// 		1
																				// 	);
																				// }}
																			>
																				<div
																					className="step-icon"
																					data-bs-toggle="tooltip"
																					data-bs-placement="top"
																					title="Token Details"
																				>
																					1
																				</div>
																			</NavLink>
																		</NavItem>
																		<NavItem>
																			<NavLink
																				href="#"
																				className={classnames(
																					{
																						active:
																							activeTabFormStep ===
																							2,
																					}
																				)}
																				// onClick={() => {
																				// 	setActiveTabFormStep(
																				// 		2
																				// 	);
																				// }}
																			>
																				<div
																					className="step-icon"
																					data-bs-toggle="tooltip"
																					data-bs-placement="top"
																					title="DeFi Launchpad Info"
																				>
																					2
																				</div>
																			</NavLink>
																		</NavItem>

																		<NavItem>
																			<NavLink
																				href="#"
																				className={classnames(
																					{
																						active:
																							activeTabFormStep ===
																							3,
																					}
																				)}
																				onClick={() => {
																					setActiveTabFormStep(
																						3
																					);
																				}}
																			>
																				<div
																					className="step-icon"
																					data-bs-toggle="tooltip"
																					data-bs-placement="top"
																					title="Add Additional Info"
																				>
																					3
																				</div>
																			</NavLink>
																		</NavItem>
																		<NavItem>
																			<NavLink
																				href="#"
																				className={classnames(
																					{
																						active:
																							activeTabFormStep ===
																							4,
																					}
																				)}
																				// onClick={() => {
																				// 	setActiveTabFormStep(
																				// 		4
																				// 	);
																				// }}
																			>
																				<div
																					className="step-icon"
																					data-bs-toggle="tooltip"
																					data-bs-placement="top"
																					title="Add Additional Info"
																				>
																					4
																				</div>
																			</NavLink>
																		</NavItem>
																	</ul>

																	<TabContent
																		className="twitter-bs-wizard-tab-content"
																		activeTab={
																			activeTabFormStep
																		}
																	>
																		<TabPane
																			tabId={
																				1
																			}
																		>
																			<Form
																				// form={true}
																				// onSubmit={
																				// 	validationForFirstStep.handleSubmit
																				// }
																				onSubmit={(
																					e
																				) => {
																					e.preventDefault();
																					validationForFirstStep.handleSubmit();
																					return false;
																				}}
																			>
																				<div className="text-center mb-4">
																					<h5>
																						Verify
																						Token
																					</h5>
																					<p className="card-title-desc">
																						Enter
																						the
																						token
																						address
																						and
																						verify
																					</p>
																				</div>
																				<div className="row">
																					{/* <div className="col-lg-2"></div> */}
																					<div className="col-lg-12">
																						<div className="mb-3">
																							<label
																								htmlFor="basicpill-firstname-input"
																								className="form-label"
																							>
																								Token
																								Address
																							</label>
																							<Input
																								name="tokenAddress"
																								type="text"
																								onChange={
																									validationForFirstStep.handleChange
																								}
																								onBlur={
																									validationForFirstStep.handleBlur
																								}
																								value={
																									validationForFirstStep
																										.values
																										.tokenAddress ||
																									""
																								}
																								invalid={
																									validationForFirstStep
																										.touched
																										.tokenAddress &&
																									validationForFirstStep
																										.errors
																										.tokenAddress
																										? true
																										: false
																								}
																							/>
																							{validationForFirstStep
																								.touched
																								.tokenAddress &&
																							validationForFirstStep
																								.errors
																								.tokenAddress ? (
																								<FormFeedback type="invalid">
																									{
																										validationForFirstStep
																											.errors
																											.tokenAddress
																									}
																								</FormFeedback>
																							) : null}
																						</div>

																						{/* <div className="mb-3">
																							<label
																								htmlFor="basicpill-vatno-input"
																								className="form-label"
																							>
																								Currency
																							</label>
																							<select
																								className="form-control"
																								name="currency"
																								onChange={(
																									e
																								) => {
																									validationForFirstStep.handleChange(
																										e
																									);
																									handleChangeCurrency(
																										currency.feeOption
																									);
																								}}
																								onBlur={
																									validationForFirstStep.handleBlur
																								}
																								value={
																									validationForFirstStep
																										.values
																										.currency ||
																									""
																								}
																							>
																								{launchpadOptions?.currency &&
																									launchpadOptions?.currency.data.map(
																										(
																											currency,
																											index
																										) => (
																											<option
																												value={
																													currency.name
																												}
																											>
																												{
																													currency.name
																												}
																											</option>
																										)
																									)}
																							</select>
																						</div> */}

																						<div className="mb-3">
																							<label
																								htmlFor="basicpill-vatno-input"
																								className="form-label"
																							>
																								Currency
																							</label>
																							<Input
																								name="currency"
																								type="select"
																								onChange={(
																									e
																								) => {
																									const data =
																										launchpadOptions?.currency.data.find(
																											(
																												currency
																											) =>
																												currency.name ===
																												e
																													.target
																													.value
																										);
																									handleChangeCurrency(
																										data.feeOption
																									);
																									validationForFirstStep.handleChange(
																										e
																									);
																								}}
																								onBlur={
																									validationForFirstStep.handleBlur
																								}
																								value={
																									validationForFirstStep
																										.values
																										.currency ||
																									""
																								}
																								invalid={
																									validationForFirstStep
																										.touched
																										.currency &&
																									validationForFirstStep
																										.errors
																										.currency
																										? true
																										: false
																								}
																							>
																								<option
																									value=""
																									disabled
																								>
																									Select
																									Currency
																								</option>
																								{launchpadOptions?.currency &&
																									launchpadOptions?.currency.data.map(
																										(
																											currency,
																											index
																										) => (
																											<option
																												key={`${index}currency`}
																												value={
																													currency.name
																												}
																											>
																												{
																													currency.name
																												}
																											</option>
																										)
																									)}
																							</Input>
																							{validationForFirstStep
																								.touched
																								.feeOption &&
																							validationForFirstStep
																								.errors
																								.feeOption ? (
																								<FormFeedback type="invalid">
																									{
																										validationForFirstStep
																											.errors
																											.feeOption
																									}
																								</FormFeedback>
																							) : null}
																						</div>

																						{/* <div className="mb-3">
																							<h5 className="font-size-14 mb-3">
																								Currency
																							</h5>

																							{launchpadOptions?.currency &&
																								launchpadOptions?.currency.data.map(
																									(
																										currency,
																										index
																									) => (
																										<div
																											key={
																												index
																											}
																											className="form-check mb-3"
																										>
																											<Input
																												name="currency"
																												type="radio"
																												id={`${currency.name}${index}`}
																												// onChange={
																												// 	validationForFirstStep.handleChange
																												// }
																												onClick={(
																													e
																												) => {
																													validationForFirstStep.handleChange(
																														e
																													);
																													handleChangeCurrency(
																														currency.feeOption
																													);
																												}}
																												onChange={(
																													e
																												) => {
																													validationForFirstStep.handleChange(
																														e
																													);
																													handleChangeCurrency(
																														currency.feeOption
																													);
																												}}
																												onBlur={
																													validationForFirstStep.handleBlur
																												}
																												// checked={
																												// 	validationForFirstStep
																												// 		.values
																												// 		.currency ===
																												// 	currency.name
																												// 		? true
																												// 		: false
																												// }
																												defaultChecked={
																													validationForFirstStep
																														.values
																														.currency ===
																													currency.name
																														? true
																														: false
																												}
																												value={
																													currency.name
																												}
																											/>
																											<label
																												className="form-check-label"
																												htmlFor={`${currency.name}${index}`}
																											>
																												{
																													currency.name
																												}
																											</label>
																										</div>
																									)
																								)}
																							{validationForFirstStep
																								.touched
																								.currency &&
																							validationForFirstStep
																								.errors
																								.currency ? (
																								<FormFeedback type="invalid">
																									{
																										validationForFirstStep
																											.errors
																											.currency
																									}
																								</FormFeedback>
																							) : null}
																						</div> */}

																						<div className="mb-3">
																							<label
																								htmlFor="basicpill-vatno-input"
																								className="form-label"
																							>
																								Fee
																								Options
																							</label>
																							<Input
																								name="feeOption"
																								type="select"
																								onChange={(
																									e
																								) => {
																									validationForFirstStep.handleChange(
																										e
																									);
																								}}
																								onBlur={
																									validationForFirstStep.handleBlur
																								}
																								value={
																									validationForFirstStep
																										.values
																										.feeOption ||
																									""
																								}
																								invalid={
																									validationForFirstStep
																										.touched
																										.feeOption &&
																									validationForFirstStep
																										.errors
																										.feeOption
																										? true
																										: false
																								}
																							>
																								<option
																									value=""
																									disabled
																								>
																									Select
																									Fee
																									option
																								</option>
																								{currencyFeeOptions &&
																									currencyFeeOptions.map(
																										(
																											fee,
																											index
																										) => (
																											<option
																												key={`${index}fee`}
																												value={
																													fee.fee
																												}
																											>
																												{
																													fee.description
																												}
																											</option>
																										)
																									)}
																							</Input>
																							{validationForFirstStep
																								.touched
																								.feeOption &&
																							validationForFirstStep
																								.errors
																								.feeOption ? (
																								<FormFeedback type="invalid">
																									{
																										validationForFirstStep
																											.errors
																											.feeOption
																									}
																								</FormFeedback>
																							) : null}
																						</div>

																						{/* <div className="mb-4">
																							<h5 className="font-size-14 mb-3">
																								Fee
																								Options
																							</h5>

																							{currencyFeeOptions &&
																								currencyFeeOptions.map(
																									(
																										fee,
																										index
																									) => (
																										<div
																											key={
																												index
																											}
																											className="form-check mb-3"
																										>
																											<Input
																												name="feeOption"
																												type="radio"
																												// id={`${fee.fee}${index}fee`}
																												// onChange={
																												// 	validationForFirstStep.handleChange
																												// }
																												onClick={(
																													e
																												) => {
																													e.target.value =
																														validationForFirstStep.values.feeOption;
																													validationForFirstStep.handleChange(
																														e
																													);
																												}}
																												onChange={(
																													e
																												) => {
																													e.target.value =
																														validationForFirstStep.values.feeOption;
																													// validationForFirstStep.handleChange(
																													// 	e
																													// );
																												}}
																												onBlur={
																													validationForFirstStep.handleBlur
																												}
																												// defaultChecked={
																												// 	validationForFirstStep
																												// 		.values
																												// 		.feeOption
																												// 		.fee !==
																												// 	undefined
																												// 		? validationForFirstStep
																												// 				.values
																												// 				.feeOption
																												// 				.fee ===
																												// 		  fee.fee
																												// 		: false
																												// }
																												checked={
																													validationForFirstStep
																														.values
																														.feeOption
																														.fee !==
																													undefined
																														? validationForFirstStep
																																.values
																																.feeOption
																																.fee ===
																														  fee.fee
																															? true
																															: false
																														: index ===
																														  0
																														? true
																														: false
																												}
																												value={
																													validationForFirstStep
																														.values
																														.feeOption
																												}
																											/>
																											<label
																												className="form-check-label"
																												// htmlFor={`${fee.fee}${index}fee`}
																											>
																												{
																													fee.description
																												}
																											</label>
																										</div>
																									)
																								)}
																							{validationForFirstStep
																								.touched
																								.feeOption &&
																							validationForFirstStep
																								.errors
																								.feeOption ? (
																								<FormFeedback type="invalid">
																									{
																										validationForFirstStep
																											.errors
																											.feeOption
																									}
																								</FormFeedback>
																							) : null}
																						</div> */}
																					</div>
																				</div>
																				<div className="row">
																					<div className="col-lg-12">
																						<div className="mb-3">
																							<label
																								htmlFor="basicpill-vatno-input"
																								className="form-label"
																							>
																								Listing
																								Options
																							</label>
																							<Input
																								name="listingOption"
																								type="select"
																								onChange={
																									validationForFirstStep.handleChange
																								}
																								onBlur={
																									validationForFirstStep.handleBlur
																								}
																								value={
																									validationForFirstStep
																										.values
																										.listingOption ||
																									""
																								}
																								invalid={
																									validationForFirstStep
																										.touched
																										.listingOption &&
																									validationForFirstStep
																										.errors
																										.listingOption
																										? true
																										: false
																								}
																							>
																								<option
																									value=""
																									disabled
																								>
																									Select
																									option
																								</option>
																								<option
																									value={
																										"automatic"
																									}
																								>
																									Auto
																									Listing
																								</option>
																								<option
																									value={
																										"manual"
																									}
																								>
																									Manual
																									Listing
																								</option>
																							</Input>
																							{validationForFirstStep
																								.touched
																								.listingOption &&
																							validationForFirstStep
																								.errors
																								.listingOption ? (
																								<FormFeedback type="invalid">
																									{
																										validationForFirstStep
																											.errors
																											.listingOption
																									}
																								</FormFeedback>
																							) : null}
																						</div>
																					</div>
																				</div>
																			</Form>
																		</TabPane>
																		<TabPane
																			tabId={
																				2
																			}
																		>
																			<Form
																				// form={true}
																				// onSubmit={
																				// 	validationForSecondStep.handleSubmit
																				// }
																				onSubmit={(
																					e
																				) => {
																					e.preventDefault();
																					validationForSecondStep.handleSubmit();
																					return false;
																				}}
																			>
																				<div>
																					<div className="text-center mb-4">
																						<h5>
																							DeFi
																							Launchpad
																							Info
																						</h5>
																						<p className="card-title-desc">
																							Enter
																							the
																							launchpad
																							information
																							that
																							you
																							want
																							to
																							raise
																							,
																							that
																							should
																							be
																							enter
																							all
																							details
																							about
																							your
																							presale
																						</p>
																					</div>
																					<div className="row">
																						<div className="col-lg-12">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Presale
																									rate
																								</label>
																								<Input
																									name="presaleRate"
																									type="text"
																									onChange={
																										validationForSecondStep.handleChange
																									}
																									onBlur={
																										validationForSecondStep.handleBlur
																									}
																									value={
																										validationForSecondStep
																											.values
																											.presaleRate ||
																										""
																									}
																									invalid={
																										validationForSecondStep
																											.touched
																											.presaleRate &&
																										validationForSecondStep
																											.errors
																											.presaleRate
																											? true
																											: false
																									}
																								/>
																								{validationForSecondStep
																									.touched
																									.presaleRate &&
																								validationForSecondStep
																									.errors
																									.presaleRate ? (
																									<FormFeedback type="invalid">
																										{
																											validationForSecondStep
																												.errors
																												.presaleRate
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>

																						<div className="col-lg-12">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-vatno-input"
																									className="form-label"
																								>
																									Whitelist
																								</label>
																								<select
																									className="form-control"
																									name="whiteList"
																									onChange={
																										validationForSecondStep.handleChange
																									}
																									onBlur={
																										validationForSecondStep.handleBlur
																									}
																									value={
																										validationForSecondStep
																											.values
																											.whiteList ||
																										""
																									}
																								>
																									<option value="Enable">
																										Enable
																									</option>
																									<option value="Disable">
																										Disable
																									</option>
																								</select>
																							</div>
																						</div>
																					</div>

																					<div className="row">
																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Softcap
																								</label>
																								<Input
																									name="softcap"
																									type="text"
																									onChange={
																										validationForSecondStep.handleChange
																									}
																									onBlur={
																										validationForSecondStep.handleBlur
																									}
																									value={
																										validationForSecondStep
																											.values
																											.softcap ||
																										""
																									}
																									invalid={
																										validationForSecondStep
																											.touched
																											.softcap &&
																										validationForSecondStep
																											.errors
																											.softcap
																											? true
																											: false
																									}
																								/>
																								{validationForSecondStep
																									.touched
																									.softcap &&
																								validationForSecondStep
																									.errors
																									.softcap ? (
																									<FormFeedback type="invalid">
																										{
																											validationForSecondStep
																												.errors
																												.softcap
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>

																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Hardcap
																								</label>
																								<Input
																									name="hardcap"
																									type="text"
																									onChange={
																										validationForSecondStep.handleChange
																									}
																									onBlur={
																										validationForSecondStep.handleBlur
																									}
																									value={
																										validationForSecondStep
																											.values
																											.hardcap ||
																										""
																									}
																									invalid={
																										validationForSecondStep
																											.touched
																											.hardcap &&
																										validationForSecondStep
																											.errors
																											.hardcap
																											? true
																											: false
																									}
																								/>
																								{validationForSecondStep
																									.touched
																									.hardcap &&
																								validationForSecondStep
																									.errors
																									.hardcap ? (
																									<FormFeedback type="invalid">
																										{
																											validationForSecondStep
																												.errors
																												.hardcap
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>
																					</div>
																					<div className="row">
																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Minimum
																									Buy
																								</label>
																								<Input
																									name="minimumBuy"
																									type="text"
																									onChange={
																										validationForSecondStep.handleChange
																									}
																									onBlur={
																										validationForSecondStep.handleBlur
																									}
																									value={
																										validationForSecondStep
																											.values
																											.minimumBuy ||
																										""
																									}
																									invalid={
																										validationForSecondStep
																											.touched
																											.minimumBuy &&
																										validationForSecondStep
																											.errors
																											.minimumBuy
																											? true
																											: false
																									}
																								/>
																								{validationForSecondStep
																									.touched
																									.minimumBuy &&
																								validationForSecondStep
																									.errors
																									.minimumBuy ? (
																									<FormFeedback type="invalid">
																										{
																											validationForSecondStep
																												.errors
																												.minimumBuy
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>

																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Maximum
																									Buy
																								</label>
																								<Input
																									name="maximumBuy"
																									type="text"
																									onChange={
																										validationForSecondStep.handleChange
																									}
																									onBlur={
																										validationForSecondStep.handleBlur
																									}
																									value={
																										validationForSecondStep
																											.values
																											.maximumBuy ||
																										""
																									}
																									invalid={
																										validationForSecondStep
																											.touched
																											.maximumBuy &&
																										validationForSecondStep
																											.errors
																											.maximumBuy
																											? true
																											: false
																									}
																								/>
																								{validationForSecondStep
																									.touched
																									.maximumBuy &&
																								validationForSecondStep
																									.errors
																									.maximumBuy ? (
																									<FormFeedback type="invalid">
																										{
																											validationForSecondStep
																												.errors
																												.maximumBuy
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>
																					</div>
																					<div className="row">
																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-vatno-input"
																									className="form-label"
																								>
																									Refund
																									Type
																								</label>

																								<Input
																									name="refundType"
																									type="select"
																									onChange={
																										validationForSecondStep.handleChange
																									}
																									onBlur={
																										validationForSecondStep.handleBlur
																									}
																									value={
																										validationForSecondStep
																											.values
																											.refundType ||
																										""
																									}
																									invalid={
																										validationForSecondStep
																											.touched
																											.refundType &&
																										validationForSecondStep
																											.errors
																											.refundType
																											? true
																											: false
																									}
																								>
																									<option
																										value=""
																										disabled
																									>
																										Select
																										refund
																										type
																									</option>
																									{launchpadOptions?.refundType &&
																										launchpadOptions?.refundType.data.map(
																											(
																												type,
																												refundTypeIndex
																											) => (
																												<option
																													key={
																														type.name +
																														refundTypeIndex
																													}
																													value={
																														type.name
																													}
																												>
																													{
																														type.name
																													}
																												</option>
																											)
																										)}
																								</Input>
																								{validationForSecondStep
																									.touched
																									.refundType &&
																								validationForSecondStep
																									.errors
																									.refundType ? (
																									<FormFeedback type="invalid">
																										{
																											validationForSecondStep
																												.errors
																												.refundType
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>

																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-vatno-input"
																									className="form-label"
																								>
																									Router
																								</label>
																								<Input
																									name="router"
																									type="select"
																									onChange={
																										validationForSecondStep.handleChange
																									}
																									onBlur={
																										validationForSecondStep.handleBlur
																									}
																									value={
																										validationForSecondStep
																											.values
																											.router ||
																										""
																									}
																									invalid={
																										validationForSecondStep
																											.touched
																											.router &&
																										validationForSecondStep
																											.errors
																											.router
																											? true
																											: false
																									}
																								>
																									<option
																										value=""
																										disabled
																									>
																										Select
																										router
																									</option>
																									{launchpadOptions?.router &&
																										launchpadOptions?.router.data.map(
																											(
																												type,
																												routerIndex
																											) => (
																												<option
																													key={
																														type.name +
																														routerIndex
																													}
																													value={
																														type.name
																													}
																												>
																													{
																														type.name
																													}
																												</option>
																											)
																										)}
																								</Input>
																								{validationForSecondStep
																									.touched
																									.router &&
																								validationForSecondStep
																									.errors
																									.router ? (
																									<FormFeedback type="invalid">
																										{
																											validationForSecondStep
																												.errors
																												.router
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>
																					</div>

																					<div className="row">
																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									liquidity
																								</label>
																								<Input
																									name="liquidity"
																									type="text"
																									onChange={
																										validationForSecondStep.handleChange
																									}
																									onBlur={
																										validationForSecondStep.handleBlur
																									}
																									value={
																										validationForSecondStep
																											.values
																											.liquidity ||
																										""
																									}
																									invalid={
																										validationForSecondStep
																											.touched
																											.liquidity &&
																										validationForSecondStep
																											.errors
																											.liquidity
																											? true
																											: false
																									}
																								/>
																								{validationForSecondStep
																									.touched
																									.liquidity &&
																								validationForSecondStep
																									.errors
																									.liquidity ? (
																									<FormFeedback type="invalid">
																										{
																											validationForSecondStep
																												.errors
																												.liquidity
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>

																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Listing
																									rate
																								</label>
																								<Input
																									name="listingRate"
																									type="text"
																									onChange={
																										validationForSecondStep.handleChange
																									}
																									onBlur={
																										validationForSecondStep.handleBlur
																									}
																									value={
																										validationForSecondStep
																											.values
																											.listingRate ||
																										""
																									}
																									invalid={
																										validationForSecondStep
																											.touched
																											.listingRate &&
																										validationForSecondStep
																											.errors
																											.listingRate
																											? true
																											: false
																									}
																								/>
																								{validationForSecondStep
																									.touched
																									.listingRate &&
																								validationForSecondStep
																									.errors
																									.listingRate ? (
																									<FormFeedback type="invalid">
																										{
																											validationForSecondStep
																												.errors
																												.listingRate
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>
																					</div>

																					<div className="row">
																						<div className="col-lg-6">
																							<FormGroup className="mb-3">
																								<Label>
																									Start
																									Date
																								</Label>

																								<InputGroup>
																									<Flatpickr
																										className={`form-control d-block ${
																											validationForSecondStep
																												.touched
																												.startDate &&
																											validationForSecondStep
																												.errors
																												.startDate
																												? "is-invalid"
																												: ""
																										}`}
																										placeholder="Select start date"
																										options={{
																											altInput: true,
																											altFormat:
																												"Y-m-d H:i",
																											dateFormat:
																												"Y-m-d H:i",
																											enableTime: true,
																											time_24hr: true,
																										}}
																										onChange={(
																											date,
																											dateInString
																										) => {
																											handleDateChange(
																												"startDate",
																												dateInString
																											);
																										}}
																										onBlur={
																											validationForSecondStep.handleBlur
																										}
																										value={
																											validationForSecondStep
																												.values
																												.startDate ||
																											""
																										}
																										invalid={
																											validationForSecondStep
																												.touched
																												.startDate &&
																											validationForSecondStep
																												.errors
																												.startDate
																												? "true"
																												: "false"
																										}
																										name="startDate"
																									/>
																									{/* <div className="input-group-append">
																										<span className="input-group-text">
																											<i className="mdi mdi-clock-outline" />
																										</span>
																									</div> */}
																									{validationForSecondStep
																										.touched
																										.startDate &&
																									validationForSecondStep
																										.errors
																										.startDate ? (
																										<FormFeedback type="invalid">
																											{
																												validationForSecondStep
																													.errors
																													.startDate
																											}
																										</FormFeedback>
																									) : null}
																								</InputGroup>
																							</FormGroup>
																						</div>

																						<div className="col-lg-6">
																							<FormGroup className="mb-3">
																								<Label>
																									End
																									Date
																								</Label>

																								<InputGroup>
																									<Flatpickr
																										className={`form-control d-block ${
																											validationForSecondStep
																												.touched
																												.endDate &&
																											validationForSecondStep
																												.errors
																												.endDate
																												? "is-invalid"
																												: ""
																										}`}
																										placeholder="Select end date"
																										options={{
																											altInput: true,
																											altFormat:
																												"Y-m-d H:i",
																											dateFormat:
																												"Y-m-d H:i",
																											enableTime: true,
																											time_24hr: true,
																										}}
																										name="endDate"
																										onChange={(
																											date,
																											dateInString
																										) => {
																											handleDateChange(
																												"endDate",
																												dateInString
																											);
																										}}
																										onBlur={
																											validationForSecondStep.handleBlur
																										}
																										value={
																											validationForSecondStep
																												.values
																												.endDate ||
																											""
																										}
																									/>
																									{/* <div className="input-group-append">
																										<span className="input-group-text">
																											<i className="mdi mdi-clock-outline" />
																										</span>
																									</div> */}
																									{validationForSecondStep
																										.touched
																										.endDate &&
																									validationForSecondStep
																										.errors
																										.endDate ? (
																										<FormFeedback type="invalid">
																											{
																												validationForSecondStep
																													.errors
																													.endDate
																											}
																										</FormFeedback>
																									) : null}
																								</InputGroup>
																							</FormGroup>
																						</div>
																					</div>

																					<div className="row">
																						<div className="col-lg-12">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Liquidity
																									lockup
																									(days)
																								</label>
																								<Input
																									name="liquidityLockup"
																									type="text"
																									onChange={
																										validationForSecondStep.handleChange
																									}
																									onBlur={
																										validationForSecondStep.handleBlur
																									}
																									value={
																										validationForSecondStep
																											.values
																											.liquidityLockup ||
																										""
																									}
																									invalid={
																										validationForSecondStep
																											.touched
																											.liquidityLockup &&
																										validationForSecondStep
																											.errors
																											.liquidityLockup
																											? true
																											: false
																									}
																								/>
																								{validationForSecondStep
																									.touched
																									.liquidityLockup &&
																								validationForSecondStep
																									.errors
																									.liquidityLockup ? (
																									<FormFeedback type="invalid">
																										{
																											validationForSecondStep
																												.errors
																												.liquidityLockup
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>
																					</div>
																				</div>
																			</Form>
																		</TabPane>

																		<TabPane
																			tabId={
																				3
																			}
																		>
																			<Form
																				// form={true}
																				// onSubmit={
																				// 	validationForThirdStep.handleSubmit
																				// }
																				onSubmit={(
																					e
																				) => {
																					e.preventDefault();
																					validationForThirdStep.handleSubmit();
																					return false;
																				}}
																			>
																				<div>
																					<div className="text-center mb-4">
																						<h5>
																							Add
																							Additional
																							Info
																						</h5>
																						<p className="card-title-desc">
																							Let
																							people
																							know
																							who
																							you
																							are
																						</p>
																					</div>
																					<div className="row">
																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									LogoURL
																								</label>
																								<Input
																									name="logoURL"
																									type="text"
																									onChange={
																										validationForThirdStep.handleChange
																									}
																									onBlur={
																										validationForThirdStep.handleBlur
																									}
																									value={
																										validationForThirdStep
																											.values
																											.logoURL ||
																										""
																									}
																									invalid={
																										validationForThirdStep
																											.touched
																											.logoURL &&
																										validationForThirdStep
																											.errors
																											.logoURL
																											? true
																											: false
																									}
																								/>
																								{validationForThirdStep
																									.touched
																									.logoURL &&
																								validationForThirdStep
																									.errors
																									.logoURL ? (
																									<FormFeedback type="invalid">
																										{
																											validationForThirdStep
																												.errors
																												.logoURL
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>

																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Website
																								</label>
																								<Input
																									name="websiteURL"
																									type="text"
																									onChange={
																										validationForThirdStep.handleChange
																									}
																									onBlur={
																										validationForThirdStep.handleBlur
																									}
																									value={
																										validationForThirdStep
																											.values
																											.websiteURL ||
																										""
																									}
																									invalid={
																										validationForThirdStep
																											.touched
																											.websiteURL &&
																										validationForThirdStep
																											.errors
																											.websiteURL
																											? true
																											: false
																									}
																								/>
																								{validationForThirdStep
																									.touched
																									.websiteURL &&
																								validationForThirdStep
																									.errors
																									.websiteURL ? (
																									<FormFeedback type="invalid">
																										{
																											validationForThirdStep
																												.errors
																												.websiteURL
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>
																					</div>

																					<div className="row">
																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Facebook
																								</label>
																								<Input
																									name="facebook"
																									type="text"
																									onChange={
																										validationForThirdStep.handleChange
																									}
																									onBlur={
																										validationForThirdStep.handleBlur
																									}
																									value={
																										validationForThirdStep
																											.values
																											.facebook ||
																										""
																									}
																									invalid={
																										validationForThirdStep
																											.touched
																											.facebook &&
																										validationForThirdStep
																											.errors
																											.facebook
																											? true
																											: false
																									}
																								/>
																								{validationForThirdStep
																									.touched
																									.facebook &&
																								validationForThirdStep
																									.errors
																									.facebook ? (
																									<FormFeedback type="invalid">
																										{
																											validationForThirdStep
																												.errors
																												.facebook
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>

																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Twitter
																								</label>
																								<Input
																									name="twitter"
																									type="text"
																									onChange={
																										validationForThirdStep.handleChange
																									}
																									onBlur={
																										validationForThirdStep.handleBlur
																									}
																									value={
																										validationForThirdStep
																											.values
																											.twitter ||
																										""
																									}
																									invalid={
																										validationForThirdStep
																											.touched
																											.twitter &&
																										validationForThirdStep
																											.errors
																											.twitter
																											? true
																											: false
																									}
																								/>
																								{validationForThirdStep
																									.touched
																									.twitter &&
																								validationForThirdStep
																									.errors
																									.twitter ? (
																									<FormFeedback type="invalid">
																										{
																											validationForThirdStep
																												.errors
																												.twitter
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>
																					</div>

																					<div className="row">
																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Github
																								</label>
																								<Input
																									name="github"
																									type="text"
																									onChange={
																										validationForThirdStep.handleChange
																									}
																									onBlur={
																										validationForThirdStep.handleBlur
																									}
																									value={
																										validationForThirdStep
																											.values
																											.github ||
																										""
																									}
																									invalid={
																										validationForThirdStep
																											.touched
																											.github &&
																										validationForThirdStep
																											.errors
																											.github
																											? true
																											: false
																									}
																								/>
																								{validationForThirdStep
																									.touched
																									.github &&
																								validationForThirdStep
																									.errors
																									.github ? (
																									<FormFeedback type="invalid">
																										{
																											validationForThirdStep
																												.errors
																												.github
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>

																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Telegram
																								</label>
																								<Input
																									name="telegram"
																									type="text"
																									onChange={
																										validationForThirdStep.handleChange
																									}
																									onBlur={
																										validationForThirdStep.handleBlur
																									}
																									value={
																										validationForThirdStep
																											.values
																											.telegram ||
																										""
																									}
																									invalid={
																										validationForThirdStep
																											.touched
																											.telegram &&
																										validationForThirdStep
																											.errors
																											.telegram
																											? true
																											: false
																									}
																								/>
																								{validationForThirdStep
																									.touched
																									.telegram &&
																								validationForThirdStep
																									.errors
																									.telegram ? (
																									<FormFeedback type="invalid">
																										{
																											validationForThirdStep
																												.errors
																												.telegram
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>
																					</div>

																					<div className="row">
																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Instagram
																								</label>
																								<Input
																									name="instagram"
																									type="text"
																									onChange={
																										validationForThirdStep.handleChange
																									}
																									onBlur={
																										validationForThirdStep.handleBlur
																									}
																									value={
																										validationForThirdStep
																											.values
																											.instagram ||
																										""
																									}
																									invalid={
																										validationForThirdStep
																											.touched
																											.instagram &&
																										validationForThirdStep
																											.errors
																											.instagram
																											? true
																											: false
																									}
																								/>
																								{validationForThirdStep
																									.touched
																									.instagram &&
																								validationForThirdStep
																									.errors
																									.instagram ? (
																									<FormFeedback type="invalid">
																										{
																											validationForThirdStep
																												.errors
																												.instagram
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>

																						<div className="col-lg-6">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Reddit
																								</label>
																								<Input
																									name="reddit"
																									type="text"
																									onChange={
																										validationForThirdStep.handleChange
																									}
																									onBlur={
																										validationForThirdStep.handleBlur
																									}
																									value={
																										validationForThirdStep
																											.values
																											.reddit ||
																										""
																									}
																									invalid={
																										validationForThirdStep
																											.touched
																											.reddit &&
																										validationForThirdStep
																											.errors
																											.reddit
																											? true
																											: false
																									}
																								/>
																								{validationForThirdStep
																									.touched
																									.reddit &&
																								validationForThirdStep
																									.errors
																									.reddit ? (
																									<FormFeedback type="invalid">
																										{
																											validationForThirdStep
																												.errors
																												.reddit
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>
																					</div>

																					<div className="row">
																						<div className="col-lg-12">
																							<div className="mb-3">
																								<label
																									htmlFor="basicpill-firstname-input"
																									className="form-label"
																								>
																									Description
																								</label>
																								<Input
																									name="description"
																									type="text"
																									onChange={
																										validationForThirdStep.handleChange
																									}
																									onBlur={
																										validationForThirdStep.handleBlur
																									}
																									value={
																										validationForThirdStep
																											.values
																											.description ||
																										""
																									}
																									invalid={
																										validationForThirdStep
																											.touched
																											.description &&
																										validationForThirdStep
																											.errors
																											.description
																											? true
																											: false
																									}
																								/>
																								{validationForThirdStep
																									.touched
																									.description &&
																								validationForThirdStep
																									.errors
																									.description ? (
																									<FormFeedback type="invalid">
																										{
																											validationForThirdStep
																												.errors
																												.description
																										}
																									</FormFeedback>
																								) : null}
																							</div>
																						</div>
																					</div>
																				</div>
																			</Form>
																		</TabPane>

																		<TabPane
																			tabId={
																				4
																			}
																		>
																			<div>
																				<div className="text-center mb-4">
																					<h5>
																						Finish
																					</h5>
																					<p className="card-title-desc">
																						Review
																						your
																						information
																					</p>
																				</div>
																			</div>
																			<Card>
																				<CardHeader>
																					<h5 className="card-title mb-0">
																						Review
																					</h5>
																				</CardHeader>
																				<CardBody>
																					<div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Token
																											Address
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForFirstStep
																													.values
																													.tokenAddress
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>

																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Token
																											Name
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForFirstStep
																													.values
																													.tokenName
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Token
																											Symbol
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForFirstStep
																													.values
																													.tokenSymbol
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>

																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Token
																											Decimal
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForFirstStep
																													.values
																													.tokenDecimal
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>

																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Presale
																											rate
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForSecondStep
																													.values
																													.presaleRate
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Listing
																											rate
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForSecondStep
																													.values
																													.listingRate
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Listing
																											rate
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForSecondStep
																													.values
																													.listingRate
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Softcap
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForSecondStep
																													.values
																													.softcap
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Hardcap
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForSecondStep
																													.values
																													.hardcap
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Refund
																											Type
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForSecondStep
																													.values
																													.refundType
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Minimum
																											buy
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForSecondStep
																													.values
																													.minimumBuy
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Maximum
																											buy
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForSecondStep
																													.values
																													.maximumBuy
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Liquidity
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForSecondStep
																													.values
																													.liquidity
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Start
																											Time
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForSecondStep
																													.values
																													.startDate
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											End
																											Time
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForSecondStep
																													.values
																													.endDate
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Liquidity
																											lockup
																											time
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForSecondStep
																													.values
																													.liquidityLockup
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Logo
																											URL
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForThirdStep
																													.values
																													.logoURL
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Website
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForThirdStep
																													.values
																													.websiteURL
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Facebook
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForThirdStep
																													.values
																													.facebook
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Twitter
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForThirdStep
																													.values
																													.twitter
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Github
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForThirdStep
																													.values
																													.github
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Telegram
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForThirdStep
																													.values
																													.telegram
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Instagram
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForThirdStep
																													.values
																													.instagram
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Discord
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForThirdStep
																													.values
																													.discord
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Reddit
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForThirdStep
																													.values
																													.reddit
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																						<div className="pb-2">
																							<Row>
																								<Col
																									xl={
																										3
																									}
																								>
																									<div>
																										<h5 className="font-size-15">
																											Description
																										</h5>
																									</div>
																								</Col>
																								<div className="col-xl">
																									<div className="text-muted">
																										<p className="mb-2">
																											{
																												validationForThirdStep
																													.values
																													.description
																											}
																										</p>
																									</div>
																								</div>
																							</Row>
																						</div>
																					</div>
																				</CardBody>
																			</Card>
																		</TabPane>
																	</TabContent>
																	<ul className="pager wizard twitter-bs-wizard-pager-link">
																		{activeTabFormStep !==
																			1 && (
																			<li
																				className={
																					activeTabFormStep ===
																					1
																						? "previous disabled"
																						: "previous"
																				}
																			>
																				<Link
																					to="#"
																					className={
																						activeTabFormStep ===
																						1
																							? "btn btn-primary disabled"
																							: "btn btn-primary"
																					}
																					onClick={() => {
																						toggleTab(
																							activeTabFormStep -
																								1,
																							true
																						);
																					}}
																				>
																					<i className="bx bx-chevron-left me-1"></i>{" "}
																					Previous
																				</Link>
																			</li>
																		)}

																		<li
																			className={
																				activeTabFormStep ===
																				4
																					? "next disabled"
																					: "next"
																			}
																		>
																			<Link
																				to="#"
																				className="btn btn-primary"
																				onClick={() => {
																					activeTabFormStep ===
																					4
																						? handleFinalFormSubmit()
																						: toggleTab(
																								activeTabFormStep +
																									1
																						  );
																				}}
																			>
																				{activeTabFormStep ===
																				4
																					? "Submit"
																					: "Next"}
																				<i className="bx bx-chevron-right ms-1"></i>
																			</Link>
																		</li>
																	</ul>
																</div>
															</fieldset>
														</ModalBody>
													</Modal>
												</div>
											</div>
										</Col>
									</Row>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Container>
			</div>
		</React.Fragment>
	);
};

export default Launchpad;
