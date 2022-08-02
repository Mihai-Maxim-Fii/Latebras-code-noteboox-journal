import {useEffect, useState, useReducer, useImperativeHandle, useRef, useCallback} from "react";
import React from "react"
import {motion} from "framer-motion"
interface CarouselItems{
    set_index:any,
    items:any,

}
interface CarouselRef{
    next:()=>void,
    back:()=>void
}

const Carousel= (props:CarouselItems,ref:React.Ref<any>):JSX.Element => {
   const next_button_ref=useRef<HTMLButtonElement>(null)
   const back_button_ref=useRef<HTMLButtonElement>(null)
   const image_ref = useRef<HTMLInputElement>(null)
   

   useImperativeHandle(ref,useCallback(()=>{
     return {
         next:go_next,
         back:go_back,
         index:get_index
     }

   },[])) 


   const get_index = useCallback( ()=>{
       if (image_ref.current!==null)
          return image_ref.current?.value
       
   },[image_ref])


  

   const go_next = useCallback( ()=>{
    next_button_ref.current?.click()
   },[next_button_ref])

   const go_back = useCallback( ()=>{
    back_button_ref.current?.click()
   },[back_button_ref])


    const elementsReducer = (state:any, action:any) => {
        if (action.type === "UPDATE_ELEMENTS") {

            return {
                currentIndex: state.currentIndex,
                selectedElements: [...action.payload]
            };
        } else if (action.type === "INCREMENT_INDEX") {
            return {
                currentIndex: state.currentIndex + action.payload,
                selectedElements: state.selectedElements
            };
        } else if (action.type === "UPDATE_ELEMENTS_AND_SHIFT") {
            if (state.currentIndex === action.payload.length) {
                return {
                    currentIndex: action.payload.length - 1,
                    selectedElements: [...action.payload]
                };
            }
            return {
                currentIndex: state.currentIndex,
                selectedElements: [...action.payload]
            };
        } else if(action.type === "CHANGE_INDEX"){
            return {
                currentIndex: action.payload,
                selectedElements: state.selectedElements
            };
        }
        else
         {
            return state;
        }
    };
    

    const [elementsState, dispatchElements] = useReducer(elementsReducer, {
        currentIndex: 0,
        selectedElements: []
    });

    useEffect ( ()=>{
        props.set_index(elementsState.selectedElements[elementsState.currentIndex])
    },[elementsState.selectedElements[elementsState.currentIndex]])
 

    const goNext = () => {
        if (elementsState.currentIndex + 1 < elementsState.selectedElements.length) {
            dispatchElements({type: "INCREMENT_INDEX", payload: 1});
        } else {
            
            let index = props.items.indexOf(elementsState.selectedElements[elementsState.currentIndex]);
            let my_selected_elements = [...elementsState.selectedElements];
            if (index + 1 < props.items.length) {
                my_selected_elements.shift();
                my_selected_elements.push(props.items[index + 1]);
            } else {
                my_selected_elements.shift();
                my_selected_elements.push(props.items[0]);
            }
            dispatchElements({type: "UPDATE_ELEMENTS", payload: my_selected_elements});
        }
    };

    const goBack = () => {
        if (elementsState.currentIndex + -1 >= 0) {
            dispatchElements({type: "INCREMENT_INDEX", payload: -1});
        } else {
            let index = props.items.indexOf(elementsState.selectedElements[elementsState.currentIndex]);
            let my_selected_elements = [...elementsState.selectedElements];
            if (index - 1 >= 0) {
                my_selected_elements.pop();
                my_selected_elements.unshift(props.items[index - 1]);
            } else {
                my_selected_elements.pop();
                my_selected_elements.unshift(props.items[props.items.length - 1]);
            }
            dispatchElements({type: "UPDATE_ELEMENTS", payload: my_selected_elements});
        }
    };
    useEffect(() => {
        let items = [];
        let ind = 0;
        for (let i = 0; i < Math.min(Math.floor(window.innerWidth / 50), props.items.length); i++) {
            items.push(props.items[ind]);
            if (ind + 1 < props.items.length) {
                ind += 1;
            } else {
                ind = props.items.length - 1;
            }
        }
        dispatchElements({type: "UPDATE_ELEMENTS", payload: items});
    }, [props.items]);

    const handle_resize = () => {  

        let items = elementsState.selectedElements
        if(elementsState.selectedElements.length!==0){
        if ((elementsState.selectedElements.length < Math.floor(window.innerWidth / 50)) && elementsState.selectedElements.length < props.items.length) {
            let new_index = props.items.indexOf(elementsState.selectedElements[elementsState.selectedElements.length - 1])
            if (new_index + 1 < props.items.length) {
                items.push(props.items[new_index + 1])
            } else {
                items.push(props.items[0])
            }
        } else if (elementsState.selectedElements.length > Math.floor(window.innerWidth / 50)) {
            items.pop()
        }
        dispatchElements({type: "UPDATE_ELEMENTS_AND_SHIFT", payload: items});
    }
    


        
        
    };


    const [width, setWidth] = useState(window.innerWidth)
    const selectImage = (item:any) =>{
        const new_index = elementsState.selectedElements.indexOf(item)        
        dispatchElements({
            type:"CHANGE_INDEX",
            payload:new_index
        })
    }

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWidth(window.innerWidth)
        });
    }, [])

    useEffect(() => {
        handle_resize()
    }, [width])

    return (
        <div>
            <div className=" flex gap-2">
                {
                elementsState.selectedElements.map((item:any, index:number) => {
                    return (
                        <motion.img key={index} src={item}

                        onClick={()=>selectImage(item)}
                        whileHover={
                            {
                                scale:1.25,

                            }
                        }
                            style={
                                {
                                    width: "50px",
                                    height: "50px",
                                    borderRadius:"10px",
                                    border: elementsState.currentIndex === index ? "1px solid yellow" : "",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }
                        }>
                             </motion.img>
                    );
                })
            } </div>
            <div style={
                {display: "flex"}
            }>
                <input type="text" className=" hidden" value={elementsState.selectedElements[elementsState.currentIndex]} ref={image_ref}></input>
                <button className=" hidden"  ref={back_button_ref} onClick={goBack}>Back</button>
                <button  className=" hidden"  ref={next_button_ref} onClick={goNext}>Next</button>
            </div>
        </div>
    );
};
export default React.forwardRef(Carousel)
