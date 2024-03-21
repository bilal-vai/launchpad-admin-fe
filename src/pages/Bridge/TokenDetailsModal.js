import React, { useState, useEffect } from "react";
import {
	Col,
	Row,
	Modal,
	ModalHeader,
	ModalBody,
	FormFeedback,
	FormText,
	Form,
	Label,
	Input,
	FormGroup,
	InputGroup,
	Alert,
} from "reactstrap";

import "flatpickr/dist/themes/material_blue.css";
// import Flatpickr from "react-flatpickr";
// import { Grid } from "@mui/material";
// import Checkbox from "react-custom-checkbox";
// import LiveDateTime from "./LiveDateTime";

const TokenDetailsModal = ({
	tokenInfoModalDetails,
	toggleTokenInfoModal,
	validationForTokenInfoStep,

	// couldHaveAddUpdatePermission,
	launchpadOptions
}) => {
	 return (
		<React.Fragment>
			<Modal isOpen={tokenInfoModalDetails.active} size="lg" centered={true}>
				<ModalHeader
					toggle={() => {
						toggleTokenInfoModal({
							...tokenInfoModalDetails,
							active: !tokenInfoModalDetails.active,
						});
						validationForTokenInfoStep.resetForm();
					}}
					tag="h4"
				>
					{tokenInfoModalDetails.action === "edit"
						? "Edit Tokens"
						: "Add Tokens"}
				</ModalHeader>
				<ModalBody>
					<Form
						onSubmit={(e) => {
							e.preventDefault();
							validationForTokenInfoStep.handleSubmit();
							return false;
						}}
					>
						<fieldset>
						{/* disabled={!couldHaveAddUpdatePermission()} */}
							<div className="row">
							

										<div className="row">
										<div className="col-lg-12">
											<div className="mb-3">
											<label className="control-label">
												Symbol
											</label>

											<Input
												name="symbol"
												type="text"
												onChange={
													validationForTokenInfoStep.handleChange
												}
												onBlur={
													validationForTokenInfoStep.handleBlur
												}
												value={
													validationForTokenInfoStep.values
														.symbol || ""
												}
												invalid={
													validationForTokenInfoStep.touched
														.symbol &&
														validationForTokenInfoStep.errors
														.symbol
														? true
														: false
												}
											/>

											{validationForTokenInfoStep.touched.symbol &&
											validationForTokenInfoStep.errors.symbol ? (
												<FormFeedback type="invalid">
													{
														validationForTokenInfoStep
															.errors.symbol
													}
												</FormFeedback>
											) : null}
										</div>
									</div>

									<div className="col-lg-12">
											<div className="mb-3">
											<label className="control-label">
												Token Address
											</label>

											<Input
												name="address"
												type="text"
												onChange={
													validationForTokenInfoStep.handleChange
												}
												onBlur={
													validationForTokenInfoStep.handleBlur
												}
												value={
													validationForTokenInfoStep.values
														.address || ""
												}
												invalid={
													validationForTokenInfoStep.touched
														.address &&
														validationForTokenInfoStep.errors
														.address
														? true
														: false
												}
											/>

											{validationForTokenInfoStep.touched.address &&
											validationForTokenInfoStep.errors.address ? (
												<FormFeedback type="invalid">
													{
														validationForTokenInfoStep
															.errors.address
													}
												</FormFeedback>
											) : null}
										</div>
									</div>

									<div className="row">
									<div className="col-lg-12">
										<div className="mb-3">
											<label className="control-label">
												Bridge Address
											</label>

											<Input
												name="bridgeAddress"
												type="text"
												onChange={
													validationForTokenInfoStep.handleChange
												}
												onBlur={
													validationForTokenInfoStep.handleBlur
												}
												value={
													validationForTokenInfoStep.values
														.bridgeAddress || ""
												}
												invalid={
													validationForTokenInfoStep.touched
														.bridgeAddress &&
														validationForTokenInfoStep.errors
														.bridgeAddress
														? true
														: false
												}
											/>

											{validationForTokenInfoStep.touched.bridgeAddress &&
											validationForTokenInfoStep.errors.bridgeAddress ? (
												<FormFeedback type="invalid">
													{
														validationForTokenInfoStep
															.errors.bridgeAddress
													}
												</FormFeedback>
											) : null}
										</div>
									</div>
								</div>
								

									<div className="col-lg-12">
											<div className="mb-3">
											<label className="control-label">
												Gateway Address
											</label>

											<Input
												name="gatewayAddress"
												type="text"
												onChange={
													validationForTokenInfoStep.handleChange
												}
												onBlur={
													validationForTokenInfoStep.handleBlur
												}
												value={
													validationForTokenInfoStep.values
														.gatewayAddress || ""
												}
												invalid={
													validationForTokenInfoStep.touched
														.gatewayAddress &&
														validationForTokenInfoStep.errors
														.gatewayAddress
														? true
														: false
												}
											/>

											{validationForTokenInfoStep.touched.gatewayAddress &&
											validationForTokenInfoStep.errors.gatewayAddress ? (
												<FormFeedback type="invalid">
													{
														validationForTokenInfoStep
															.errors.gatewayAddress
													}
												</FormFeedback>
											) : null}
										</div>
									</div>

									



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
							</div>
							</div>
						</fieldset>
					</Form>
				</ModalBody>
			</Modal>
		</React.Fragment>
	 );
};

export default TokenDetailsModal;
