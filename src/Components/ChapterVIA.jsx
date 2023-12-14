import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormVisible,setDeduction } from "../assets/Store/store";
import { deductionValues } from "./InitialValues";
const ChapterVIA = ()=>{
    const [formData, setFormData] = useState(deductionValues)
    const dispatch = useDispatch()
    const formVisible = useSelector((state) => state.data.formVisible)
    const visibility = useSelector((state) => state.data.formVisible.deduction)
        const user = JSON.parse(localStorage.getItem('userInfo'))
        const dob = user? JSON.parse(localStorage.getItem('userInfo')).dob : new Date();
        const dobDt = new Date(dob?dob:new Date());
        const curDate = new Date()
        const ageDate = new Date(curDate - dobDt);
        const years = ageDate.getUTCFullYear() - 1970;


    const handleInput = (e) => {
        const { name, value } = e.target;   
        
        if(name==="sec80c"){
            setFormData({ ...formData, [name]: Math.min(value,150000) })
            return;
        }
        if(name==="sec80tta"){
            setFormData({ ...formData, [name]: Math.min(value,10000) })
            return;
        }
        if(name==="sec80c"){
            setFormData({ ...formData, [name]: Math.min(value,50000) })
            return;
        }
        
        setFormData({ ...formData, [name]: value })
    }
    const convertDecimal = (name) => {
        const decimals = formData[name] || 0;
        let {total,...deduction} = formData;
        let totalDeduction = [].concat(...Object.values(deduction)).map(Number)
        total = (totalDeduction.reduce((a,b)=>a+b,0)).toFixed(2)
        setFormData({ ...formData, [name]: parseFloat(decimals).toFixed(2),total:total })
        dispatch(setDeduction(total))
    }
return(
    <div className={visibility ? "fixed top-0 left-0 w-screen h-screen flex z-30 justify-center items-center select-none font-poppins" : "hidden"} id="chaptervia">
            {visibility && (
                <div className="bg-white w-2/3 px-1 py-2">
                    <button
                        onClick={() => dispatch(setFormVisible({ formVisible }))}
                        className="ml-2 px-2 text-xl bg-orange-300" type="button">x</button>
                    <form >
                        <div className="w-full flex gap-2 items-center relative px-2 py-1">

                            <label className="form-label w-3/5 " htmlFor="sec80c">Life insurance,Housing Loan Principal etc.</label>
                            <input type="number"
                                id="sec80c"
                                name="sec80c"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("sec80c")}
                                required
                                value={formData.sec80c} />

                        </div>
                        <div className="w-full flex gap-2 items-center relative px-2 py-1">
                            <label className="form-label w-3/5 " htmlFor="sec80ccd">Contribution to NPS</label>
                            <input type="number"
                                id="sec80ccd"
                                name="sec80ccd"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("sec80ccd")}
                                required
                                value={formData.sec80ccd} />

                        </div>
                        <div className="w-full flex gap-2 items-center relative px-2 py-1">
                            <label className="form-label w-3/5 " htmlFor="sec80d">Mediclaim Premium</label>
                            <input type="number"
                                id="sec80d"
                                name="sec80d"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("sec80d")}
                                required
                                value={formData.sec80d} />

                        </div>

                        <div className="w-full flex gap-2 items-center relative px-2 py-1">
                            <label className="form-label w-3/5 " htmlFor="sec80e">Interest on Education Loan</label>
                            <input type="number"
                                id="sec80e"
                                name="sec80e"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("sec80e")}
                                required
                                value={formData.sec80e} />

                        </div>
                        <div className="w-full flex gap-2 items-center relative px-2 py-1">
                            <label className="form-label w-3/5 " htmlFor="sec80g">Donations</label>
                            <input type="number"
                                id="sec80g"
                                name="sec80g"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("sec80g")}
                                required
                                value={formData.sec80g} />


                        </div>
                        <div className="w-full flex gap-2 items-center relative px-2 py-1">
                        <label className="form-label w-3/5" htmlFor="sec80gg">Deduction for Rent paid</label>
                        <input type="number"
                            id="sec80gg"
                            name="sec80gg"
                            className="form-inputs w-2/5"
                            onChange={handleInput}
                            onBlur={() => convertDecimal("sec80gg")}
                            required
                            value={formData.sec80gg} />
                    </div>
                        <div className="w-full flex gap-2 items-center relative px-2 py-1">
                            <label className="form-label w-3/5" htmlFor="sec80tta">Deduction for SB interest (Age less than 60)</label>
                            <input type="number"
                                id="sec80tta"
                                name="sec80tta"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("sec80tta")}
                                required
                                readOnly={years>=60}
                                value={formData.sec80tta} />
                        </div>
                        <div className="w-full flex gap-2 items-center relative px-2 py-1">
                            <label className="form-label w-3/5" htmlFor="sec80ttb">Deduction for SB/FD  interest (60 or Above)</label>
                            <input type="number"
                                id="sec80ttb"
                                name="sec80ttb"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("sec80ttb")}
                                required
                                readOnly={years<60}
                                value={formData.sec80ttb} />
                        </div>
                        <div className="w-full flex gap-2 items-center relative px-2 py-1">
                            <label className="form-label w-3/5" htmlFor="sec80u">Deduction for Disability</label>
                            <input type="number"
                                id="sec80u"
                                name="sec80u"
                                className="form-inputs w-2/5"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("sec80u")}
                                required
                                value={formData.sec80u} />
                        </div>
                        <div className="w-full flex gap-2 items-center relative px-2 py-1">
                        <label className="form-label w-3/5" htmlFor="others">Other Deductions</label>
                        <input type="number"
                            id="others"
                            name="others"
                            className="form-inputs w-2/5"
                            onChange={handleInput}
                            onBlur={() => convertDecimal("others")}
                            required
                            value={formData.others} />
                    </div>
                    <div className="w-full flex gap-2 items-center relative px-2 py-1">
                    <label className="form-label w-3/5 font-bold" htmlFor="total">Total Deductions</label>
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
};

export default ChapterVIA;