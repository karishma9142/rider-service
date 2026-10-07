import axios from "axios";
import { getChannel } from "./rabbitmq.js";
import { Rider } from "../model/rider.js";

export const startOrderReadyConsumer = async() => {
    const channel = getChannel();

    console.log('Starting to cosume from:' , process.env.ORDER_READY_QUEUE);

    channel.consume(process.env.ORDER_READY_QUEUE! , async(msg) => {
        if(!msg) return;

        try {
            console.log('Recieved Message' , msg.content.toString());

            const event = JSON.parse(msg.content.toString());
            console.log("event type" , event.type);

            if(event.type !== 'ORDER_READY_FOR_RIDER'){
                console.log('skipping non-order-ready-for-rider event');
                channel.ack(msg);
                return;
            }

            const {orderId,restaurantId,location } = event.data;
            console.log('Searching for rider near:' , location)
            const riders = await Rider.find({
                isAvailble:true,
                isVerified : true,
                location : {
                    $near:{
                        $geometry : location,
                        $maxDistance : 500,
                    }
                }
            });

            console.log(`found ${riders.length} nearby riders`);

            if(riders.length === 0){
                console.log('no riders available nearby');
                channel.ack(msg);
                return;
            }

            for (const rider of riders){
                console.log(`notifying rider userId : ${rider.userId}`);

                try {
                    await axios.post(`${process.env.REALTIME_SERVER}/api/internal/emit` , {
                        event : 'order:available',
                        room:`user:${rider.userId}`,
                        payload : {orderId , restaurantId}
                    },{
                        headers : {
                            'x-internal-key' : process.env.INTERNAL_SERVICE_KAY
                        }
                    });
                    console.log(`notifies rider ${rider.userId} successfully`)
                } catch (error) {
                    console.log(`failed to notify rider ${rider.userId}`)
                }
            }

            channel.ack(msg);
            console.log('meaasge ackonleged')
        } catch (error) {
            console.log('OrderReady consumer error : ',error)
        }
    });
}