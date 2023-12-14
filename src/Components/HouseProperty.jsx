/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFormVisible, setHouse } from "../assets/Store/store";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";


const HouseProperty = () => {
    const [formData, setFormData] = useState(false)
    const [formInputs, setFormInputs] = useState(false)
    const visibility = useSelector((state) => state.data.formVisible.house)
    const formVisible = useSelector((state) => state.data.formVisible)
    const [readOnlyInput,setReadonly] = useState({})
    const [showHouse, setShowHouse] = useState('')
    let selectedHead = useSelector((state) => state.data.selectedHeads);
    let scheme = selectedHead !== undefined ? selectedHead[5] : JSON.parse(localStorage.getItem('heads'))[5]
    const dispatch = useDispatch();
    const [noOfHouse, setNoofHouse] = useState("")
    
 
    const handleInput = (e) => {
        const { name, value } = e.target;
        
        if(name.search("type")!==-1){
            const gross = "gross"+name.match(/\d/)[0];
            const ptax = "ptax"+name.match(/\d/)[0];
            const interest = "interest"+name.match(/\d/)[0];
            const standard = "standard"+name.match(/\d/)[0]
            const net = "net"+name.match(/\d/)[0]
            
            if(!value||value==="self"&&scheme===false){
                
                setReadonly({...readOnlyInput,[gross]:true,[ptax]:true,[interest]:true})
                setFormData({...formData,[name]:value,[gross]:(0).toFixed(2),
                    [ptax]:(0).toFixed(2),[standard]:(0).toFixed(2),
                    [interest]:(0).toFixed(2),
                    [net]:(0).toFixed(2)})
            }
            else {
                setReadonly({...readOnlyInput,[gross]:false,[ptax]:false,[interest]:false})
                setFormData({...formData,[name]:value,[gross]:"",[ptax]:"",[standard]:"",[interest]:""})
            }
        }
        else if(name.search("ptax")!==-1){
            const grossId = "gross"+name.match(/\d/)[0];
            const stdId = "standard"+name.match(/\d/)[0]
            const intId = "interest"+name.match(/\d/)[0]
            const netId = "net"+name.match(/\d/)[0];
            const gross = formData[grossId]||0
            const interest =formData[intId]||0
            
            const stdDeduction = (gross-value) *0.30;
            const net = parseFloat(gross) - parseFloat(value)-parseFloat(stdDeduction) - parseFloat(interest);
            setFormData({...formData,[name]:value,[stdId]:stdDeduction,[netId]:Math.max(net.toFixed(2),(-200000).toFixed(2)) })
        }
        else if(name.search("gross")!==-1){
            const ptaxId = "ptax"+name.match(/\d/)[0];
            const stdId = "standard"+name.match(/\d/)[0]
            const intId = "interest"+name.match(/\d/)[0]
            const netId = "net"+name.match(/\d/)[0];
            const ptax = formData[ptaxId]||0
            const interest =formData[intId]||0
            const stdDeduction = (value-ptax) *0.30;
            const net = parseFloat(value) - parseFloat(ptax)-parseFloat(stdDeduction) - parseFloat(interest);
            setFormData({...formData,[name]:value,[stdId]:stdDeduction,[netId]:Math.max(net.toFixed(2),(-200000).toFixed(2)) })
        }
        else if(name.search("interest")!==-1){
            const grossId = "gross"+name.match(/\d/)[0];
            const ptaxId = "ptax"+name.match(/\d/)[0];
            const netId = "net"+name.match(/\d/)[0];
            const stdId = "standard"+name.match(/\d/)[0];
            const type = "type"+name.match(/\d/)[0];
            const gross = formData[grossId]||0
            const ptax = formData[ptaxId]||0;
            const standard = formData[stdId]||0;
            const net = parseFloat(gross) - parseFloat(ptax)-parseFloat(standard) - parseFloat(value);
            
            if(net<0 && formData[type]==="self"){
                setFormData({ ...formData, [name]: Math.min(value,200000),[netId]:Math.max(net.toFixed(2),(-200000).toFixed(2)) })
                return;
            }
            setFormData({ ...formData, [name]: value,[netId]:Math.max(net.toFixed(2),(-200000).toFixed(2)) })

        }
        else {
            setFormData({ ...formData, [name]: value})
        }
        

    }
    
  

    const toggleHouse = (houseNo) => {
        if(showHouse ===houseNo){
            setShowHouse("")
            return;
        }
        setShowHouse(houseNo)
        
    }


    const addHouse = () => {
        const formValues = {};
        const readonlyValues = {};
        
        setFormData(false)
        setFormInputs(false)
        for (let i = 1; i <= noOfHouse; i++) {
            formValues[`gross${i}`] = ""
            formValues[`ptax${i}`] = ""
            formValues[`interest${i}`] = ""
            formValues[`net${i}`] = ""
            formValues[`standard${i}`] = ""
            formValues[`type${i}`] = ""
            readonlyValues[`gross${i}`] = true
            readonlyValues[`ptax${i}`] = true
            readonlyValues[`interest${i}`] = true
        }
        const no = Array.from({length: noOfHouse},(a,b)=>b+1)
        setFormInputs(no)
        setFormData(formValues)
        setReadonly(readonlyValues)

    }



    return (
        <div className={visibility ? "fixed top-0 left-0 w-screen h-screen flex z-30 justify-center items-center select-none font-poppins" : "hidden"} id="houseproperty">
            {visibility && (
                <div className="bg-white w-3/5 px-1 py-2">
                    <button
                        onClick={() => {
                            dispatch(setFormVisible({ formVisible }))
                            const totalHP = Object.entries(formData).filter(([key,value])=>{
                                if(key.includes("net")){
                                    return value;
                                }
                            }).reduce((a,[,b])=>parseFloat(a)+parseFloat(b),0)
                            
                            dispatch(setHouse(totalHP))
                        }}
                        className="ml-2 px-2 text-xl bg-orange-300" type="button">x</button>
                    <div className="w-full flex gap-2 items-center relative p-2">
                        <label className="form-label w-3/5 " htmlFor="nos">No of House property</label>
                        <input type="number"
                            id="nos"
                            name="nos"
                            className="form-inputs w-2/5"
                            onChange={(e) => setNoofHouse(e.target.value)}
                            required
                            value={noOfHouse} />

                    </div>

                    <button
                        onClick={addHouse}
                        className="px-2 py-1 bg-blue-500 text-white ml-2 rounded-md">Add</button>

                    {formInputs&&formInputs.map((i) => (
                        <div className="flex flex-col mt-4 w-full border border-indigo-300" key={i}>
                        <div className="flex px-2 items-center gap-2">
                      
                        <span className="text-base font-bold px-2 underline tracking-wider cursor-pointer w-3/5"
                        onClick={() => toggleHouse(`house${i}`)}>  <FontAwesomeIcon icon={showHouse === `house${i}` ?faCaretUp:faCaretDown}/>
                        House{i}</span>
                        <span className="text-gray-700   focus:bg-cyan-300 text-right text-sm md:text-base lg:text-lg w-2/5 px-2">
                        {formData[`net${i}`]?parseFloat(formData[`net${i}`]).toLocaleString("en-IN"):0}</span>
                        </div>
                        
                            <div className={showHouse === `house${i}` ? "flex flex-col opacity" : "hidden"}>
                                <div className="w-full flex gap-2 items-center relative p-2">
                                    <label className="house-label w-3/5" htmlFor={`type${i}`}>Property Type</label>
                                    <select
                                        className="house-inputs w-2/5 !text-left"
                                        id={`type${i}`} name={`type${i}`}
                                        type="number" onChange={handleInput} value={formData[`type${i}`]} >
                                        <option value=''>None</option>
                                        <option value='self'>Self Occupied</option>
                                        <option value='rent'>Let out for Rent</option>
                                        </select>
                                </div>
                                <div className="w-full flex gap-2 items-center relative p-2">
                                    <label className="house-label w-3/5" htmlFor={`gross${i}`}>Gross Rent</label>
                                    <input
                                        className="house-inputs w-2/5 "
                                        id={`gross${i}`} name={`gross${i}`}
                                        onChange={handleInput} 
                                        value={formData[`gross${i}`]}
                                        readOnly={readOnlyInput[`gross${i}`]}
                                        type="number" />

                                </div>
                                <div className="w-full flex gap-2 items-center relative p-2">
                                    <label className="house-label w-3/5" htmlFor={`ptax${i}`}>(-) Property Tax</label>
                                    <input
                                        className="house-inputs w-2/5 "
                                        id={`ptax${i}`} name={`ptax${i}`}
                                        onChange={handleInput} 
                                        value={formData[`ptax${i}`]}
                                        readOnly={readOnlyInput[`ptax${i}`]}
                                        type="number"  />

                                </div>
                                <div className="w-full flex gap-2 items-center relative p-2">
                                <label className="house-label w-3/5" htmlFor={`standard${i}`}>(-) Deduction @ 30%</label>
                                <input
                                    className="house-inputs w-2/5 "
                                    id={`standard${i}`} name={`standard${i}`}
                                    readOnly
                                    type="number" onChange={handleInput} value={formData[`standard${i}`]} />

                            </div>
                                <div className="w-full flex gap-2 items-center relative p-2">
                                    <label className="house-label w-3/5" htmlFor={`interest${i}`}>(-) Interest Paid</label>
                                    <input
                                        className="house-inputs w-2/5 "
                                        id={`interest${i}`} name={`interest${i}`}
                                        type="number" 
                                        onChange={handleInput} 
                                        value={formData[`interest${i}`]} 
                                        readOnly={readOnlyInput[`interest${i}`]}
                                        />

                                </div>
                                <div className="w-full flex gap-2 items-center relative p-2">
                                    <label className="house-label w-3/5" htmlFor={`net${i}`}>Net  Rent</label>
                                    <input
                                        className="house-inputs w-2/5 "
                                        id={`net${i}`} name={`net${i}`}
                                        readOnly
                                        type="number" onChange={handleInput} value={formData[`net${i}`]} />

                                </div>
                            </div>

                        </div>
                    ))}

                    {formInputs && (
                        <div className="flex  mt-4 w-full border border-indigo-300 items-center">
                        <span className="text-base font-bold px-2  tracking-wider cursor-pointer w-3/5">Income from House Property</span>
                        <span className="text-gray-700   focus:bg-cyan-300 text-right text-sm md:text-base lg:text-lg w-2/5 px-4 ">{ Object.entries(formData).filter(([key,value])=>{
                        
                            if(key.includes("net")){
                                return value;
                            }
                        }).reduce((a,[,b])=>parseFloat(a)+parseFloat(b),0).toLocaleString("en-IN")}</span>

                    </div>
                    )}
                </div>
            )}
        </div>
    )
};

export default HouseProperty;