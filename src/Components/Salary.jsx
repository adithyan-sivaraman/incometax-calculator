/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { salaryValues } from "./InitialValues";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setHraCalc, setFormVisible, setSalary } from "../assets/Store/store";
import { useSelector } from "react-redux";


const SalaryIncome = () => {
    const [formData, setFormData] = useState(salaryValues)
    const [hraCalc, showHraCalc] = useState(false);
    const visibility = useSelector((state) => state.data.formVisible.salary)
    const formVisible = useSelector((state) => state.data.formVisible)
    const dispatch = useDispatch();
        const user = JSON.parse(localStorage.getItem('userInfo'))
        const city = user? JSON.parse(localStorage.getItem('userInfo')).city : "NA";
        const hraPerc = city ==="metro" ? 0.50 : 0.40;
    let selectedHead = useSelector((state) => state.data.selectedHeads);
    let scheme = selectedHead !== undefined ? selectedHead[5] : JSON.parse(localStorage.getItem('heads'))[5]

    const handleInput = (e) => {
        const { name, value } = e.target;

        if (name === 'rent' || name === 'gsal' || name === 'hrarecd') {
            dispatch(setHraCalc(true))
        }
        setFormData({ ...formData, [name]: (value) })

    }
    const calcNetSalary = () => {
        
        const gross = parseFloat(formData.gross) || parseFloat(0);
        const ptax = parseFloat(formData.ptax) || parseFloat(0);
        const hra = parseFloat(formData.hra) || parseFloat(0);
        const others = parseFloat(formData.others) || parseFloat(0);
        const net = gross - ptax - hra - others;
        let standard = 0;
        if (!scheme) {
            standard = 0
        }
        else {
            standard = net > 50000 ? 50000 : net
        }
        const netSalary = Math.max(net - standard, 0);

        // Ensure that netSalary and standard are numbers before updating state
        if (!isNaN(netSalary) && !isNaN(standard)) {
            setFormData({ ...formData, net: netSalary.toFixed(2), standard: parseFloat(standard).toFixed(2) || 0 });
            dispatch(setSalary(netSalary));
        }
    };
    const calcHRa = () => {


        const gsal = parseFloat(formData.gsal) || parseFloat(0);
        const hrarecd = parseFloat(formData.hrarecd) || parseFloat(0);
        const rent = parseFloat(formData.rent) || parseFloat(0);
        const hraValue = Math.min(gsal * hraPerc, hrarecd, rent - gsal * .10)
        
        setFormData({ ...formData, hra: hraValue > 0 ? parseFloat(hraValue).toFixed(2) : parseFloat(0).toFixed(2) });
        dispatch(setHraCalc(false))
    }

    const convertDecimal = (name) => {
        const decimals = formData[name] || 0;
        setFormData({ ...formData, [name]: parseFloat(decimals).toFixed(2) })
    }

    useEffect(() => {
        calcNetSalary()

    }, [formData.gross, formData.ptax, formData.others, formData.hra, scheme])

    useEffect(() => {
        if(!scheme){
            const value = (0).toFixed(2)
            setFormData({ ...formData,hra:value,ptax:value,others:value,gsal:value,rent:value,hrarecd:value})
        }
        
    },[scheme])

    return (
        <div className={visibility ? "fixed top-0 left-0 w-screen h-screen flex z-30 justify-center items-center select-none font-poppins" : "hidden"} id="salary">
            {visibility && (
                <div className="bg-white w-3/5 px-1 py-2">
                    <button
                        onClick={() => {
                            calcNetSalary()
                            dispatch(setFormVisible({ formVisible }))}}
                        className="ml-2 px-2 text-xl bg-orange-300" type="button">x</button>
                    <form >
                        <div className="w-full flex gap-2 items-center relative p-2">

                            <label className="form-label w-3/5 " htmlFor="gross">Gross Salary</label>
                            <input type="number"
                                id="gross"
                                name="gross"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("gross")}
                                required
                                value={formData.gross} />

                        </div>
                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/5 " htmlFor="ptax">(-) Professional Tax</label>
                            <input type="number"
                                id="ptax"
                                name="ptax"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("ptax")}
                                required
                                readOnly={!scheme}
                                value={formData.ptax} />

                        </div>
                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label
                                onClick={() => showHraCalc(!hraCalc)}
                                title={hraCalc ? "Hide HRA calculation" : "Show HRA calculation"}
                                className="form-label w-3/5  underline cursor-pointer flex justify-beween gap-2" htmlFor="hra">
                                <FontAwesomeIcon icon={hraCalc ? faCaretUp : faCaretDown} className="text-2xl  " />House rent allowance</label>
                            <input type="number"
                                id="hra"
                                name="hra"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("hra")}
                                required
                                readOnly
                                value={formData.hra} />

                        </div>
                        {hraCalc && (
                            <div>
                                <div className="w-full flex gap-2 items-center relative p-2">
                                    <label className="form-label w-1/3 !text-sm !lg:text-base font-bold " htmlFor="gsal">Basic + DA</label>
                                    <input type="number"
                                        id="gsal"
                                        name="gsal"
                                        className="form-inputs w-1/4 !text-sm !lg:text-base"
                                        onChange={handleInput}
                                        onBlur={() => convertDecimal("gsal")}
                                        required
                                        readOnly={!scheme}
                                        value={formData.gsal} />

                                </div>
                                <div className="w-full flex gap-2 items-center relative p-2">
                                    <label className="form-label w-1/3 !text-sm !lg:text-base font-bold " htmlFor="rent">Actual rent paid</label>
                                    <input type="number"
                                        id="rent"
                                        name="rent"
                                        className="form-inputs w-1/4 !text-sm !lg:text-base"
                                        onChange={handleInput}
                                        onBlur={() => convertDecimal("rent")}
                                        required
                                        readOnly={!scheme}
                                        value={formData.rent} />

                                </div>
                                <div className="w-full flex gap-2 items-center relative p-2">
                                    <label className="form-label w-1/3 !text-sm !lg:text-base font-bold relative" htmlFor="hrarecd">Actual HRA received

                                    </label>
                                    <input type="number"
                                        id="hrarecd"
                                        name="hrarecd"
                                        className="form-inputs w-1/4 !text-sm !lg:text-base"
                                        onChange={handleInput}
                                        onBlur={() => convertDecimal("hrarecd")}
                                        required
                                        readOnly={!scheme}
                                        value={formData.hrarecd} />

                                </div>

                                <span className="underline cursor-pointer ml-2 py-0 tracking-wider hover:bg-cyan-300"
                                    onClick={calcHRa}>Calculate</span>

                            </div>
                        )}
                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/5 " htmlFor="others">(-) Other Deductions</label>
                            <input type="number"
                                id="others"
                                name="others"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("others")}
                                required
                                readOnly={!scheme}
                                value={formData.others} />

                        </div>
                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/5 " htmlFor="standard">(-) Standard Deduction</label>
                            <input type="number"
                                id="standard"
                                name="standard"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                readOnly
                                required
                                value={formData.standard} />

                        </div>
                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/5  font-bold" htmlFor="net">Net Salary</label>
                            <input type="number"
                                id="net"
                                name="net"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                required
                                readOnly
                                value={formData.net} />

                        </div>
                    </form>
                </div>
            )}
        </div>
    )
};

export default SalaryIncome;