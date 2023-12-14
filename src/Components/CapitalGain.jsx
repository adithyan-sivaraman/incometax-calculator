/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { capitalGainValues } from "./InitialValues";
import { useDispatch } from "react-redux";
import {  setFormVisible } from "../assets/Store/store";
import { useSelector } from "react-redux";
import { setCapGain } from "../assets/Store/store";

const CapitalGain = () => {

    const [formData, setFormData] = useState(capitalGainValues)
    const visibility = useSelector((state) => state.data.formVisible.capgain)
    const formVisible = useSelector((state) => state.data.formVisible)
    let selectedHead = useSelector((state) => state.data.selectedHeads);
    
    
    const dispatch = useDispatch();
    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: (value) })

    }
    const convertDecimal = (name) => {
        const decimals = formData[name] || 0;
        setFormData({ ...formData, [name]: parseFloat(decimals).toFixed(2) })
        const { ltcg_shares_listed, ltcg_shares_others, ltcg_other_assets } = formData;
        const total_ltcg = Number(ltcg_shares_listed) + Number(ltcg_shares_others) + Number(ltcg_other_assets)
        const { stcg_shares_listed, stcg_shares_others, stcg_other_assets } = formData;
        const total_stcg = Number(stcg_shares_listed) + Number(stcg_shares_others) + Number(stcg_other_assets)
        const total_gain = total_ltcg + total_stcg;
    
        setFormData({ ...formData, [name]: parseFloat(decimals).toFixed(2), 
            "total_ltcg": parseFloat(total_ltcg).toFixed(2),
             "total_stcg": parseFloat(total_stcg).toFixed(2) ,
             "total_gain": parseFloat(total_gain).toFixed(2)})
            dispatch(setCapGain(formData))
    }

    useEffect(()=>{
        let isGainSelect = selectedHead[3]
        if(isGainSelect===false){
            setFormData(capitalGainValues)
            dispatch(setCapGain(capitalGainValues))
        }
    },[selectedHead])

    return (
        <div className={visibility ? "fixed top-0 left-0 w-screen h-screen flex z-30 justify-center items-center select-none font-poppins" : "hidden"} id="salary">
            {visibility && (
                <div className="bg-white w-3/5 px-1 py-2">
                    <button
                        onClick={() => dispatch(setFormVisible({ formVisible }))}
                        className="ml-2 px-2 text-xl bg-orange-300" type="button">x</button>
                    <form >
                        <div className="w-full flex gap-2 items-center relative p-2">
                            <p className="w-full  px-2 text-base lg:text-lg tracking-wider bg-indigo-200 font-bold">Long Term Capital Gain on</p>
                        </div>
                        <div className="w-full flex gap-2 items-center relative p-2">

                            <label className="form-label w-3/4 " htmlFor="ltcg_shares_listed">Listed Equity Shares and Equity Funds</label>
                            <input type="number"
                                id="ltcg_shares_listed"
                                name="ltcg_shares_listed"
                                className="form-inputs w-1/4"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("ltcg_shares_listed")}
                                required
                                value={formData.ltcg_shares_listed} />
                        </div>

                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/4 " htmlFor="ltcg_shares_others">Unlisted Securities</label>
                            <input type="number"
                                id="ltcg_shares_others"
                                name="ltcg_shares_others"
                                className="form-inputs w-1/4"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("ltcg_shares_others")}
                                required
                                value={formData.ltcg_shares_others} />
                        </div>

                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/4 " htmlFor="ltcg_other_assets">Land,Building Etc</label>
                            <input type="number"
                                id="ltcg_other_assets"
                                name="ltcg_other_assets"
                                className="form-inputs w-1/4"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("ltcg_other_assets")}
                                required
                                value={formData.ltcg_other_assets} />
                        </div>

                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/4 font-bold" htmlFor="total_ltcg">Total</label>
                            <input type="number"
                                id="total_ltcg"
                                name="total_ltcg"
                                className="form-inputs w-1/4"
                                onChange={handleInput}
                                readOnly
                                required
                                value={formData.total_ltcg} />
                        </div>

                        <div className="w-full flex gap-2 items-center relative p-2">
                            <p className="w-full  px-2 text-base lg:text-lg tracking-wider bg-indigo-200 font-bold">Short Term Capital Gain on</p>
                        </div>

                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/4 " htmlFor="stcg_shares_listed">Listed Equity Shares and Equity Funds</label>
                            <input type="number"
                                id="stcg_shares_listed"
                                name="stcg_shares_listed"
                                className="form-inputs w-1/4"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("stcg_shares_listed")}
                                required
                                value={formData.stcg_shares_listed} />
                        </div>

                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/4 " htmlFor="stcg_shares_others">Unlisted Securities</label>
                            <input type="number"
                                id="stcg_shares_others"
                                name="stcg_shares_others"
                                className="form-inputs w-1/4"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("stcg_shares_others")}
                                required
                                value={formData.stcg_shares_others} />
                        </div>

                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/4 " htmlFor="stcg_other_assets">Land,Building Etc</label>
                            <input type="number"
                                id="stcg_other_assets"
                                name="stcg_other_assets"
                                className="form-inputs w-1/4"
                                onChange={handleInput}
                                onBlur={() => convertDecimal("stcg_other_assets")}
                                required
                                value={formData.stcg_other_assets} />
                        </div>

                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/4 font-bold" htmlFor="total_stcg">Total</label>
                            <input type="number"
                                id="total_stcg"
                                name="total_stcg"
                                className="form-inputs w-1/4"
                                onChange={handleInput}
                                readOnly
                                required
                                value={formData.total_stcg} />
                        </div>

                        <div className="w-full flex gap-2 items-center relative p-2">
                            <label className="form-label w-3/4 font-bold" htmlFor="total_gain">Total Capital Gains</label>
                            <input type="number"
                                id="total_gain"
                                name="total_gain"
                                className="form-inputs w-1/4"
                                onChange={handleInput}
                                readOnly
                                required
                                value={formData.total_gain} />
                        </div>

                    </form>
                </div>
            )}
        </div>
    )
};

export default CapitalGain;