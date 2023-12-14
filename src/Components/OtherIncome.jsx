import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormVisible,setOthers } from "../assets/Store/store";
import { otherSourceValues } from "./InitialValues";
const OtherIncome = () => {
    const [formData, setFormData] = useState(otherSourceValues)
    const dispatch = useDispatch()
    const formVisible = useSelector((state) => state.data.formVisible)
    const visibility = useSelector((state) => state.data.formVisible.other)

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
        
    }
    const convertDecimal = (name) => {
        const decimals = formData[name] || 0;
        let {deduction,total,...income} = formData;
        let totalIncome = [].concat(...Object.values(income)).map(Number)
        const deductionAmt = deduction||0;
        total = (totalIncome.reduce((a,b)=>a+b,0)-deductionAmt).toFixed(2)
        setFormData({ ...formData, [name]: parseFloat(decimals).toFixed(2),total:total })
        dispatch(setOthers(total))
    }

    return (
        <div className={visibility ? "fixed top-0 left-0 w-screen h-screen flex z-30 justify-center items-center select-none font-poppins" : "hidden"} id="otherincome">
            {visibility && (
                <div className="bg-white w-3/5 px-1 py-2">
                    <button
                        onClick={() => dispatch(setFormVisible({ formVisible }))}
                        className="ml-2 px-2 text-xl bg-orange-300" type="button">x</button>
                    <form >
                        <div className="w-full flex gap-2 items-center relative p-2">

                            <label className="form-label w-3/5 " htmlFor="sbint">Interest from SB Account</label>
                            <input type="number"
                                id="sbint"
                                name="sbint"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("sbint")}
                                required
                                value={formData.sbint} />

                        </div>
                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/5 " htmlFor="fdint">Interest from Deposits</label>
                            <input type="number"
                                id="fdint"
                                name="fdint"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("fdint")}
                                required
                                value={formData.fdint} />

                        </div>
                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/5 " htmlFor="otherint">Other interest Income</label>
                            <input type="number"
                                id="otherint"
                                name="otherint"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("otherint")}
                                required
                                value={formData.otherint} />

                        </div>

                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/5 " htmlFor="dividend">Dividend received</label>
                            <input type="number"
                                id="dividend"
                                name="dividend"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("dividend")}
                                required
                                value={formData.dividend} />

                        </div>
                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/5 " htmlFor="others">Any other income</label>
                            <input type="number"
                                id="others"
                                name="others"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("others")}
                                required
                                value={formData.others} />


                        </div>
                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/5 " htmlFor="deduction">(-) Deductions</label>
                            <input type="number"
                                id="deduction"
                                name="deduction"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("deduction")}
                                required
                                value={formData.deduction} />

                        </div>
                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/5 font-bold" htmlFor="total">Income from Other Sources</label>
                            <input type="number"
                                id="total"
                                name="total"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                required
                                readOnly
                                value={formData.total} />
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default OtherIncome;