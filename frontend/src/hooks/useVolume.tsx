import { useContext } from "react"
import { VolumeContext } from "../context/VolumeContext"

export const useVolume = () => {

    const context = useContext(VolumeContext)

    if(!context){
        throw new Error("useAuth must be used within the AuthProvider")
    }

    return context
}