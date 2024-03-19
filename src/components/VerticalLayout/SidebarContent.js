import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback } from "react";
//Import Icons
import FeatherIcon from "feather-icons-react";
// //Import Scrollbar
import SimpleBar from "simplebar-react";
// MetisMenu

import HasAnyPermission from "../../common/Permission";

import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
//i18n
import { withTranslation } from "react-i18next";

const SidebarContent = (props) => {
	const ref = useRef();
	const activateParentDropdown = useCallback((item) => {
		item.classList.add("active");
		const parent = item.parentElement;
		const parent2El = parent.childNodes[1];
		if (parent2El && parent2El.id !== "side-menu") {
			parent2El.classList.add("mm-show");
		}
		if (parent) {
			parent.classList.add("mm-active");
			const parent2 = parent.parentElement;
			if (parent2) {
				parent2.classList.add("mm-show"); // ul tag
				const parent3 = parent2.parentElement; // li tag
				if (parent3) {
					parent3.classList.add("mm-active"); // li
					parent3.childNodes[0].classList.add("mm-active"); //a
					const parent4 = parent3.parentElement; // ul
					if (parent4) {
						parent4.classList.add("mm-show"); // ul
						const parent5 = parent4.parentElement;
						if (parent5) {
							parent5.classList.add("mm-show"); // li
							parent5.childNodes[0].classList.add("mm-active"); // a tag
						}
					}
				}
			}
			scrollElement(item);
			return false;
		}
		scrollElement(item);
		return false;
	}, []);

	useEffect(() => {
		const pathName = props.location.pathname;

		const initMenu = () => {
			new MetisMenu("#side-menu");
			let matchingMenuItem = null;
			const ul = document.getElementById("side-menu");
			const items = ul.getElementsByTagName("a");
			for (let i = 0; i < items.length; ++i) {
				if (pathName === items[i].pathname) {
					matchingMenuItem = items[i];
					break;
				}
			}
			if (matchingMenuItem) {
				activateParentDropdown(matchingMenuItem);
			}
		};
		initMenu();
	}, [props.location.pathname, activateParentDropdown]);

	useEffect(() => {
		ref.current.recalculate();
	});

	function scrollElement(item) {
		if (item) {
			const currentPosition = item.offsetTop;
			if (currentPosition > window.innerHeight) {
				ref.current.getScrollElement().scrollTop =
					currentPosition - 300;
			}
		}
	}

	return (
		<React.Fragment>
			<SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
				<div id="sidebar-menu">
					<ul className="metismenu list-unstyled" id="side-menu">
						<li className="menu-title">{props.t("Menu")} </li>
						<li>
							<Link to="/dashboard" className="">
								<FeatherIcon icon="home" />
								<span>{props.t("Dashboard")}</span>
							</Link>
						</li>

						<HasAnyPermission
							permission={["launchpad add", "launchpad list"]}
						>
							<li>
								<Link
									to="/launchpad"
									className=""
									aria-expanded={false}
								>
									<i className="fas fa-rocket"></i>
									<span>{props.t("Launchpad")}</span>
								</Link>
							</li>
						</HasAnyPermission>

						<HasAnyPermission
							permission={[
								"launchpad option add",
								"launchpad option list",
							]}
						>
							<li>
								<Link
									to="/launchpad-option"
									className=""
									aria-expanded={false}
								>
									<i className="fas fa-cog"></i>
									<span>{props.t("Launchpad setting")}</span>
								</Link>
							</li>
						</HasAnyPermission>

						{/* <HasAnyPermission
							permission={[
								"role add",
								"role list",
								"admin add",
								"admin list",
							]}
						>
							<li>
								<Link
									to="/#"
									className="has-arrow"
									aria-expanded={false}
								>
									<i className="fas fa-cog"></i>
									<span>
										{props.t("Admin Role Permissions")}
									</span>
								</Link>
								<ul className="sub-menu">
									<HasAnyPermission
										permission={["admin add", "admin list"]}
									>
										<li>
											<Link to="/admins" className="">
												<span>{props.t("Admins")}</span>
											</Link>
										</li>
									</HasAnyPermission>
									<HasAnyPermission
										permission={["role add", "role list"]}
									>
										<li>
											<Link to="/roles" className="">
												<span>{props.t("Roles")}</span>
											</Link>
										</li>
									</HasAnyPermission>
								</ul>
							</li>
						</HasAnyPermission> */}
					</ul>
				</div>
			</SimpleBar>
		</React.Fragment>
	);
};

SidebarContent.propTypes = {
	location: PropTypes.object,
	t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
