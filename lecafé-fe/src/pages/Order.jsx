import Navbar from "@/components/navbar/Navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImage from "../assets/images/hero.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Order() {
  return (
    <>
      <Navbar navbarClass="w-full py-6 px-24 flex justify-between items-center bg-earth" />
      <div className="p-10">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">On-going</TabsTrigger>
            <TabsTrigger value="password">Finish</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full">
                    <h1 className="text-3xl">ORDER-1902</h1>
                    <p>20 November 2024 17:00</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex">
                    <img
                      className="w-1/2 text-center rounded-md"
                      src={heroImage}
                      alt=""
                    />
                    <div className="w-1/2 p-10 flex flex-col justify-between">
                      <ul className="overflow-y-auto h-[300px]">
                        <li className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-4">
                            <img className="w-[100px]" src={heroImage} alt="" />
                            <h1 className="text-3xl">Cappucino</h1>
                          </div>
                          <p className="text-xl">Rp. 100.000 x 1</p>
                        </li>
                        <li className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-4">
                            <img className="w-[100px]" src={heroImage} alt="" />
                            <h1 className="text-3xl">Cappucino</h1>
                          </div>
                          <p className="text-xl">Rp. 100.000 x 1</p>
                        </li>
                        <li className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-4">
                            <img className="w-[100px]" src={heroImage} alt="" />
                            <h1 className="text-3xl">Cappucino</h1>
                          </div>
                          <p className="text-xl">Rp. 100.000 x 1</p>
                        </li>
                        <li className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-4">
                            <img className="w-[100px]" src={heroImage} alt="" />
                            <h1 className="text-3xl">Cappucino</h1>
                          </div>
                          <p className="text-xl">Rp. 100.000 x 1</p>
                        </li>
                        <li className="flex justify-between items-center mb-">
                          <div className="flex items-center gap-4">
                            <img className="w-[100px]" src={heroImage} alt="" />
                            <h1 className="text-3xl">Cappucino</h1>
                          </div>
                          <p className="text-xl">Rp. 100.000 x 1</p>
                        </li>
                      </ul>
                      <div>
                        <h1 className="text-3xl">Total Price: Rp. 200.000</h1>
                        <h1 className="text-3xl">Dine in on table 38</h1>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          <TabsContent value="password">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Cappucino</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default Order;
