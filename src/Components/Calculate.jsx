/* eslint-disable react-hooks/exhaustive-deps */
import SalaryIncome from "./Salary";
import { useDispatch, useSelector } from "react-redux";
import { setFormVisible } from "../assets/Store/store";
import HouseProperty from "./HouseProperty";
import TaxpayerInfo from "./TaxpayerInfo";
import { useEffect, useState } from "react";
import OtherIncome from "./OtherIncome";
import ChapterVIA from "./ChapterVIA";
import CapitalGain from "./CapitalGain";
import { incomeTaxOld } from "../../Calculation/IncomeTaxOld";
import { incomeTaxNew } from "../../Calculation/IncomeTaxNew";
const CalculateTax = () => {

    const [agriIncome, setAgriIncome] = useState(0)
    const formVisible = useSelector((state) => state.data.formVisible)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogText, setDialogText] = useState(false)
    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.data.userInfo);
    let selectedHead = useSelector((state) => state.data.selectedHeads);
    const [taxvValues, setTaxValues] = useState({
        gross: 0,
        cess: 0,
        total: 0,
        rebate: 0,
        surcharge: 0,
    })
    const [headsOfIncome, setHeadsOfIncome] = useState(selectedHead)
    const netSalary = useSelector((state) => state.data.salary) || 0
    const netHouse = useSelector((state) => state.data.house) || 0
    const netBusiness = useSelector((state) => state.data.business) || 0
    const totalCapgain = useSelector((state) =>state.data.capgain) || 0
    const capGain = totalCapgain.total_gain || 0
    const otherIncome = useSelector((state) => state.data.others) || 0
    const totalIncome = parseFloat(netSalary) + parseFloat(netHouse) + parseFloat(netBusiness) + parseInt(capGain) + parseFloat(otherIncome);
    const deduction = useSelector((state) => state.data.deduction) || 0
    let taxableIncome = headsOfIncome[5] ? Math.max(parseFloat(totalIncome) - parseFloat(deduction), 0) : Math.max(parseFloat(totalIncome), 0)

    const showForm = (head, index) => {
        if (userInfo === false && head !== "info") {
            showDialog("Please enter or save tax payer information")
            return;
        }
        if (!headsOfIncome[index] && head !== "info") {
            return;
        }
        
        dispatch(setFormVisible({ ...formVisible, [head]: true }))
    }

    const showDialog = (text) => {
        setDialogText(text)
        setDialogOpen(true)
        setTimeout(() => {
            setDialogOpen(false)
        }, 3000)
    }

    const calcIncomeTax = () => {
        const dob = JSON.parse(localStorage.getItem('userInfo')).dob;
        const dobDt = new Date(dob);
        const curDate = new Date()
        const ageDate = new Date(curDate - dobDt);
        const years = ageDate.getUTCFullYear() - 1970;
      
        const incomes = {
            salary:netSalary,
            house:netHouse,
            business:netBusiness,
            capgain:totalCapgain,
            others:otherIncome,
            deduction:deduction
        }

        const incomeTax = headsOfIncome[5] ===true? incomeTaxOld(years,incomes,agriIncome):incomeTaxNew(years,incomes,agriIncome)
        
        setTaxValues(incomeTax);
    }

    useEffect(() => {
        setHeadsOfIncome(selectedHead)
    }, [selectedHead])

    

    return (
        <div className="flex flex-col h-full w-full select-none">
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
            <p className="text-2xl font-bold px-2 w-full gradient h-14 flex items-center text-white">Income Tax Calculator for Individuals</p>

            <div className="flex flex-col grow bg-indigo-100  z-10 w-full">
            <TaxpayerInfo />
                <SalaryIncome />
                <HouseProperty />
                <CapitalGain />
                <OtherIncome />
                <ChapterVIA />
                <p onClick={() => showForm("info")}
                    className="px-2 text-lg lg:text-xl font-bold font-poppins py-2 underline cursor-pointer">Tax Payer Information</p>
                {!localStorage.getItem("userInfo") && (
                    <span className="font-bold italic ml-2 tracking-wider p-1 bg-red-400 w-72 ">Please enter Tax Payer Information</span>
                )}

                <div className="flex flex-row w-full sm:w-3/5 lg:w-1/2" id="main">
                    <div className="flex flex-col gap-2 p-2 w-2/3">

                        <p onClick={() => showForm("salary", 0)}

                            className={headsOfIncome[0] ? "income-head bg-blue-300 cursor-pointer" : "income-head bg-gray-300"}>
                            <span className={headsOfIncome[0] ? "tooltip-enabled" : "tooltip-disabled"}>{headsOfIncome[0] ? "Click to fill form" : "You have not selected this head of income"}</span>
                            Income from Salaries</p>
                        <p onClick={() => showForm("house", 1)}

                            className={headsOfIncome[1] ? "income-head bg-blue-300 cursor-pointer" : "income-head bg-gray-300"}>
                            <span className={headsOfIncome[1] ? "tooltip-enabled" : "tooltip-disabled"}>{headsOfIncome[1] ? "Click to fill form" : "You have not selected this head of income"}</span>
                            Income from House Property</p>
                        <p onClick={() => showForm("salary", 2)}

                            className={headsOfIncome[2] ? "income-head bg-blue-300 cursor-pointer" : "income-head bg-gray-300"}>
                            <span className={headsOfIncome[2] ? "tooltip-enabled" : "tooltip-disabled"}>{headsOfIncome[2] ? "Click to fill form" : "You have not selected this head of income"}</span>
                            Income from Business/Profession</p>
                        <p onClick={() => showForm("capgain", 3)}

                            className={headsOfIncome[3] ? "income-head bg-blue-300 cursor-pointer" : "income-head bg-gray-300"}>
                            <span className={headsOfIncome[3] ? "tooltip-enabled" : "tooltip-disabled"}>{headsOfIncome[3] ? "Click to fill form" : "You have not selected this head of income"}</span>
                            Capital Gains</p>
                        <p onClick={() => showForm("other", 4)}
                            className={headsOfIncome[4] ? "income-head bg-blue-300 cursor-pointer" : "income-head bg-gray-300"}>
                            <span className={headsOfIncome[4] ? "tooltip-enabled" : "tooltip-disabled"}>{headsOfIncome[4] ? "Click to fill form" : "You have not selected this head of income"}</span>
                            Income from Other Sources</p>
                        <p
                            className="income-head bg-blue-300 no-underline">Total Income</p>
                        <p onClick={() => showForm("deduction", 5)}
                            title="Click to open Form"
                            className={headsOfIncome[5] ? "income-head bg-blue-300 cursor-pointer" : "income-head bg-gray-300"}>
                            <span className={headsOfIncome[5] ? "tooltip-enabled" : "tooltip-disabled"}>{headsOfIncome[5] ? "Click to fill form" : "Not Applicable since you have selected new Scheme"}</span>
                            (-) Deductions under Chapter VI-A</p>
                        <p
                            className="income-head bg-blue-300 no-underline">Taxable Income</p>

                        <label htmlFor="agri" className="income-head bg-blue-300 no-underline">
                            <span className="tooltip-enabled">Please Enter Values only greater than Rs. 5000</span>
                            Agricultural Income</label>
                        <p className="income-head bg-blue-300 no-underline">Gross Tax</p>
                        <p className="income-head bg-blue-300 no-underline">Surcharge</p>
                        <p className="income-head bg-blue-300  no-underline">Education Cess @ 4%</p>
                        <p className="income-head bg-blue-300 no-underline ">Total Tax (Round Off)</p>
                        <button
                            onClick={calcIncomeTax}
                            className="btn-save">Caculate</button>

                    </div>
                    <div className="flex flex-col gap-2 p-2 w-1/3">
                        <span className={headsOfIncome[0] ? "income-values bg-white" : "income-values bg-gray-300"}>{parseFloat(netSalary).toLocaleString("en-IN")}</span>
                        <span className={headsOfIncome[1] ? "income-values bg-white" : "income-values bg-gray-300"}>{parseFloat(netHouse).toLocaleString("en-IN")}</span>
                        <span className={headsOfIncome[2] ? "income-values bg-white" : "income-values bg-gray-300"}>{parseFloat(netBusiness).toLocaleString("en-IN")}</span>
                        <span className={headsOfIncome[3] ? "income-values bg-white" : "income-values bg-gray-300"}>{parseFloat(capGain).toLocaleString("en-IN")}</span>
                        <span className={headsOfIncome[4] ? "income-values bg-white" : "income-values bg-gray-300"}>{parseFloat(otherIncome).toLocaleString("en-IN")}</span>
                        <span className="income-values">{parseFloat(totalIncome).toLocaleString("en-IN")}</span>
                        <span className={headsOfIncome[5] ? "income-values bg-white" : "income-values bg-gray-300"}>{headsOfIncome[5] ? parseFloat(deduction).toLocaleString("en-IN") : 0}</span>
                        <span className="income-values">{parseFloat(taxableIncome).toLocaleString("en-IN")}</span>
                        <input
                            onInput={(e) => {
                                setAgriIncome(e.target.value)
                            }}
                            onBlur={() => {

                                let income = parseFloat(agriIncome) > 5000 ? parseFloat(agriIncome) : 0;
                                setAgriIncome(income)
                            }}
                            value={(agriIncome)}
                            className="income-values !px-0"
                            id="agri"
                            type="number" />
                        <span className="income-values">{parseFloat(taxvValues.gross).toLocaleString("en-IN") || 0}</span>
                        <span className="income-values">{parseFloat(taxvValues.surcharge).toLocaleString("en-IN") || 0}</span>
                        
                        <span className="income-values">{parseFloat(taxvValues.cess).toLocaleString("en-IN") || 0}</span>
                        <span className="income-values">{parseFloat(Math.ceil(taxvValues.total/10)*10).toLocaleString("en-IN") || 0}</span>
                    </div>
                </div>

            </div>
        </div>


    )
}
export default CalculateTax;