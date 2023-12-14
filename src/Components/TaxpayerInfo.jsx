/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setFormVisible, setUserInfo, setHeads } from "../assets/Store/store";
import { taxpayerValues } from "./InitialValues";
const TaxpayerInfo = () => {
    const dispatch = useDispatch();
    const visibility = useSelector((state) => state.data.formVisible.info)
    const formVisible = useSelector((state) => state.data.formVisible)
    const [options, setOptions] = useState([false, false, false, false, false, true])
    const userInfo = useSelector((state) => state.data.userInfo);
    const selectedHeads = JSON.parse(localStorage.getItem("heads"));
    const [formData, setFormData] = useState(taxpayerValues)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogText, setDialogText] = useState(false)
    const userData = JSON.parse(localStorage.getItem("userInfo"));

    useEffect(() => {
        if (userData) {
            setFormData(userData)
        }
        if (selectedHeads) {
            setOptions(selectedHeads)
        }
    }, [])

    const handleInput = (e) => {
        const { name, value, type } = e.target;
        if (userInfo === true) {
            dispatch(setUserInfo(false))
        }
        if (type === "text") {
            setFormData({ ...formData, [name]: value.toUpperCase() })
        }
        else {
            setFormData({ ...formData, [name]: value })
        }

        if (name === "dob") {
            const dobDt = new Date(value);
            const curDt = new Date()
            if (dobDt > curDt) {
                showDialog("Please entere a valid date of birth")
                setFormData({ ...formData, [name]: "" })
            }
        }

    }

    const validatePan = () => {
        const regex = /[A-Z]{3}[P]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}/
        const { pan } = formData;
        if (pan && !regex.test(pan.toUpperCase())) {
            showDialog("Please enter a valid PAN")
            setFormData({ ...formData, pan: "" })
        }
    }
    const showDialog = (text) => {
        setDialogText(text)
        setDialogOpen(true)
        setTimeout(() => {
            setDialogOpen(false)
        }, 3000)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const filterOption = options.filter((item) => item === true)
        if (filterOption.length === 0) {
            showDialog("Please select atleast one head of income")
            return;
        }
        localStorage.setItem("userInfo", JSON.stringify(formData));

        dispatch(setUserInfo(true))
        dispatch(setFormVisible({ formVisible }))
        const { scheme } = formData;
        const prevOptions = [...options]
        if (scheme === "new") {
            prevOptions[5] = false;
        }
        else {
            prevOptions[5] = true;
        }
        
        setOptions(prevOptions)
        localStorage.setItem("heads", JSON.stringify(prevOptions));
        dispatch(setHeads(prevOptions))
        
    }
    const handleCheckBox = (index) => {
        if (userInfo === true) {
            dispatch(setUserInfo(false))
        }
        const prevOptions = [...options]
        prevOptions[index] = !prevOptions[index];
        setOptions(prevOptions)
    }


    return (
        <div className={visibility ? "fixed top-0 left-0 w-screen h-screen flex z-30 justify-center items-center select-none font-poppins" : "hidden"} id="info">
            {dialogOpen && (
                <dialog className="fixed top-0 z-50 bg-white flex flex-col px-8 py-4 rounded-md box-shadow">
                    <p className="text-xl font-bold  py-1">Alert!</p>
                    <p className="py-1 text-lg tracking-wider">{dialogText}</p>
                    <div className="flex flex-row justify-evenly py-1">
                        <button
                            onClick={() => setDialogOpen(false)}
                            className="px-2 rounded bg-black text-white inline-block py-1"
                            type="button">Close</button>
                    </div>


                </dialog>
            )}
            {visibility && (
                <div className="bg-white w-3/5 px-1 py-2">
                    <button
                        onClick={() => dispatch(setFormVisible({ formVisible }))}
                        className="ml-2 px-2 text-xl bg-orange-300" type="button">x</button>
                    <form onSubmit={handleSubmit}>
                        <div className="w-full flex gap-1items-center relative p-2">
                            <label className="form-label w-2/5 " htmlFor="fname">First Name</label>
                            <input type="text"
                                id="fname"
                                name="fname"
                                className="info-inputs w-3/5"
                                onChange={handleInput}
                                required
                                value={formData.fname} />

                        </div>
                        <div className="w-full flex gap-1items-center relative p-2">
                            <label className="form-label w-2/5 " htmlFor="lname">Last Name</label>
                            <input type="text"
                                id="lname"
                                name="lname"
                                className="info-inputs w-3/5"
                                onChange={handleInput}
                                required
                                value={formData.lname} />

                        </div>
                        <div className="w-full flex gap-1items-center relative p-2">

                            <label className="form-label w-2/5 " htmlFor="pan">PAN</label>
                            <input type="text"
                                id="pan"
                                name="pan"
                                className="info-inputs w-3/5"
                                onChange={handleInput}
                                onBlur={validatePan}
                                required
                                value={formData.pan} />

                        </div>
                        <div className="w-full flex gap-1items-center relative p-2">

                            <label className="form-label w-2/5 " htmlFor="dob">Date of Birth</label>
                            <input type="date"
                                id="dob"
                                name="dob"
                                className="info-inputs w-3/5"
                                onChange={handleInput}
                                required
                                value={formData.dob} />

                        </div>
                        <div className="w-full flex gap-1items-center relative p-2">

                            <label className="form-label w-2/5 " htmlFor="scheme">Scheme</label>
                            <select
                                id="scheme"
                                name="scheme"
                                className="info-inputs w-3/5"
                                onChange={handleInput}
                                required
                                value={formData.scheme} >
                                <option value="">None</option>
                                <option value="old">Old Scheme</option>
                                <option value="new">New Scheme</option>
                            </select>

                        </div>
                        <div className="w-full flex gap-1items-center relative p-2">

                            <label className="form-label w-2/5 " htmlFor="scheme">City</label>
                            <select
                                id="city"
                                name="city"
                                className="info-inputs w-3/5"
                                onChange={handleInput}
                                required
                                value={formData.city} >
                                <option value="">None</option>
                                <option value="metro">Chennai/Mumbai/Kolkata/Delhi</option>
                                <option value="non-metro">Non-Metro</option>
                            </select>

                        </div>
                        <p className="px-2 font-bold text-base lg:text-lg">Select Heads of Income</p>
                        <div className="w-full grid  relative p-2" id="heads">
                            <div className="flex gap-1">
                                <input
                                    onChange={() => handleCheckBox(0)}
                                    type="checkbox"
                                    checked={options[0]}
                                    id="salaries" name="salaries" />
                                <label className="text-sm lg:text-base" htmlFor="salaries">Salaries</label>

                            </div>
                            <div className="flex gap-1">
                                <input
                                    onChange={() => handleCheckBox(1)}
                                    type="checkbox"
                                    checked={options[1]}
                                    id="house" name="house" />
                                <label className="text-sm lg:text-base" htmlFor="house">House Property</label>

                            </div>
                            <div className="flex gap-1">
                                <input
                                    onChange={() => handleCheckBox(2)}
                                    type="checkbox"
                                    checked={options[2]}
                                    id="business" name="business" />
                                <label className="text-sm lg:text-base" htmlFor="business">Business</label>

                            </div>
                            <div className="flex gap-1">
                                <input
                                    onChange={() => handleCheckBox(3)}
                                    type="checkbox"
                                    checked={options[3]}
                                    id="gains" name="gains" />
                                <label className="text-sm lg:text-base" htmlFor="gains">Capital Gain</label>

                            </div>
                            <div className="flex gap-1">
                                <input
                                    onChange={() => handleCheckBox(4)}
                                    type="checkbox"
                                    checked={options[4]}
                                    id="other" name="other" />
                                <label className="text-sm lg:text-base" htmlFor="other">Other Income</label>

                            </div>
                        </div>
                        <button className="btn-save" type="submit">Save</button>
                    </form>
                </div>
            )}
        </div>
    )
}
export default TaxpayerInfo;