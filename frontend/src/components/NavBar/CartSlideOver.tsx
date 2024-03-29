import { INewOrder, Item } from '../../services/types';

import {
   useGetItemsQuery,
   useAddItemToCartMutation,
   useGetCartQuery,
   useRemoveItemFromCartMutation,
   useCreateOrderMutation,
   useRemoveAllItemsFromCartMutation
} from '../../features/api/apiSlice';
import { ImSpinner2 } from 'react-icons/im';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

type props = {
   setToggleCart: React.Dispatch<React.SetStateAction<boolean>>;
   toggleCart: boolean;
   theme: any;
};

const CartSlideOver: React.FC<props> = ({
   setToggleCart,
   toggleCart,
   theme
}) => {
   if (!toggleCart) {
      return <></>;
   }
   const [selectedItemToEdit, setSelectedItemToEdit] = useState('');
   const [selectedItemToRemove, setSelectedItemToRemove] = useState('');
   const navigate = useNavigate();
   const { user } = useSelector((state: any) => state.auth);

   const {
      data: cartData,
      isLoading,
      error,
      isFetching,

      refetch: refetchCart
   } = useGetCartQuery();

   const [
      addItemToCart,
      {
         isLoading: isAdding,
         isSuccess: isAdded,
         error: addError,
         isError: isAddError
      }
   ] = useAddItemToCartMutation();

   const {
      data: itemsData,
      isLoading: isLoadingGetItems,

      error: getItemsError,
      refetch: refetchItems
   } = useGetItemsQuery('');

   const [
      removeItemFromCart,
      {
         isLoading: isRemovingItem,
         isSuccess: isRemoved,
         error: removingItemError,
         isError: isRemoveError
      }
   ] = useRemoveItemFromCartMutation();
   const [
      removeAllItemsFromCart,
      {
         isLoading: isRemovingItems,
         isSuccess: isItemsRemoved,
         error: removingItemsError,
         isError: isItemsRemoveError
      }
   ] = useRemoveAllItemsFromCartMutation();

   const [
      createOrder,
      {
         isLoading: isOrdering,
         isSuccess: isOrdered,
         error: orderError,
         isError: isOrderError
      }
   ] = useCreateOrderMutation();

   const updateQuantity = (itemId: string, newQuantity: number) => {
      setSelectedItemToEdit(itemId);

      addItemToCart({ itemId, quantity: newQuantity }).then(() => {
         if (isAddError) {
            console.log(removingItemError);
            setSelectedItemToEdit('');
         }
         refetchCart();
         setSelectedItemToEdit('');
      });
   };

   const handleRemoveItem = (itemId: string) => {
      setSelectedItemToRemove(itemId);
      removeItemFromCart(itemId).then(() => {
         if (isRemoveError) {
            console.log(addError);
         }
         refetchCart();
         setSelectedItemToRemove('');
      });
   };

   const quantityOptions = (itemId: string) => {
      const item = itemsData?.find((item: Item) => item._id === itemId);
      let optionList = [];
      for (let i = 1; item && i <= item.quantity; i++) {
         optionList.push(i);
      }
      return optionList;
   };

   const disableCheckout = () => {
      return (
         isLoading ||
         isAdding ||
         isOrdering ||
         isRemovingItem ||
         isRemovingItems
      );
   };

   const handleCheckout = () => {
      if (cartData && cartData.items.length > 0) {
         const items = cartData.items.map((item) => {
            return { itemId: item._id, quantity: item.quantity };
         });
         const order: INewOrder = {
            userId: user._id,
            items: items,
            totalPrice: cartData.totalPrice
         };
         createOrder(order).then(() => {
            setToggleCart(false);
            if (isOrdered) {
               console.log('Order was Succesful!!');
            }
         });
      }
      // if (!isOrdered || isOrderError) {
      //    throw new Error('Frontend >> handleCheckout : Order Failed!');
      // }
      removeAllItemsFromCart().then(() => refetchCart());
      refetchItems();
      window.location.reload();
   };

   // useEffect(() => {
   //    console.log('\nItemID:', selectedItemToEdit);
   // }, [isAdded, isAddError, selectedItemToEdit]);

   return (
      <div>
         <div
            className="relative z-[100] duration-500 ease-in-out "
            aria-labelledby="slide-over-title"
            role="dialoxg"
            aria-modal="true"
         >
            <div className="fixed  inset-0 bg-slate-700 bg-opacity-75 transition-opacity"></div>

            <div className=" fixed inset-0 overflow-hidden">
               <div className="absolute inset-0 overflow-hidden">
                  <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                     <div className="pointer-events-auto w-screen max-w-md">
                        <div
                           className={`flex h-full flex-col overflow-y-scroll ${theme.mainBg} ${theme.textColor}  shadow-xl`}
                        >
                           <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                              <div className="flex items-start justify-between">
                                 <h2
                                    className="text-lg font-medium "
                                    id="slide-over-title"
                                 >
                                    Shopping cart
                                 </h2>
                                 <div className="ml-3 flex h-7 items-center">
                                    <button
                                       type="button"
                                       className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                       onClick={() => setToggleCart(false)}
                                    >
                                       <span className="sr-only">
                                          Close panel
                                       </span>
                                       <svg
                                          className="h-6 w-6"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth="1.5"
                                          stroke="currentColor"
                                          aria-hidden="true"
                                       >
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             d="M6 18L18 6M6 6l12 12"
                                          />
                                       </svg>
                                    </button>
                                 </div>
                              </div>

                              {cartData && cartData.items.length > 0 ? (
                                 <div className="mt-8 ">
                                    <div className="flow-root">
                                       <ul
                                          role="list"
                                          className="-my-6 divide-y divide-gray-100"
                                       >
                                          {cartData?.items.map((item: Item) => (
                                             <li
                                                key={item._id}
                                                className="flex py-6"
                                             >
                                                <div
                                                   className={`h-24 w-24 flex-shrink-0  overflow-hidden rounded-md border-2 p-1 ${theme.borderColor}`}
                                                >
                                                   <img
                                                      className="h-full w-full  object-contain object-center"
                                                      title={item.description}
                                                      src={
                                                         item.imageUrl +
                                                         '-/preview/400x400/-/progressive/yes/-/quality/lighter/'
                                                      }
                                                   />
                                                </div>

                                                <div className="ml-4 flex flex-1 flex-col">
                                                   <div>
                                                      <div className="flex justify-between  font-medium capitalize sm:text-lg">
                                                         <h3 className="overflow-auto ">
                                                            <a href="#">
                                                               {item.title}
                                                            </a>
                                                         </h3>
                                                         <div className="ml-4">
                                                            {(
                                                               item.quantity *
                                                               item.price
                                                            ).toLocaleString(
                                                               'en-US',
                                                               {
                                                                  style: 'currency',
                                                                  currency:
                                                                     'USD'
                                                               }
                                                            )}
                                                         </div>
                                                      </div>
                                                   </div>
                                                   <div className="flex flex-1 items-end justify-between text-sm">
                                                      <div className="ml-2 flex items-center">
                                                         <label
                                                            htmlFor={`quantity-${item._id}`}
                                                            className="text-gray-500"
                                                         >
                                                            Qty:
                                                         </label>
                                                         {isAdding &&
                                                         selectedItemToEdit ===
                                                            item._id ? (
                                                            <ImSpinner2 className="ml-5 h-7 w-7 animate-spin text-teal-600" />
                                                         ) : (
                                                            <select
                                                               id={`quantity-${item._id}`}
                                                               value={
                                                                  item?.quantity
                                                               }
                                                               disabled={
                                                                  isAdding
                                                                     ? true
                                                                     : false
                                                               }
                                                               onSelect={() =>
                                                                  setSelectedItemToEdit(
                                                                     item._id
                                                                  )
                                                               }
                                                               onChange={(e) =>
                                                                  updateQuantity(
                                                                     item._id,
                                                                     parseInt(
                                                                        e.target
                                                                           .value
                                                                     )
                                                                  )
                                                               }
                                                               className="form-select ml-3 block h-10 w-20 scale-[80%] rounded text-gray-500"
                                                            >
                                                               {quantityOptions(
                                                                  item._id
                                                               ).map(
                                                                  (
                                                                     newQuantity: number
                                                                  ) => (
                                                                     <option
                                                                        key={
                                                                           newQuantity
                                                                        }
                                                                        value={
                                                                           newQuantity
                                                                        }
                                                                     >
                                                                        {
                                                                           newQuantity
                                                                        }
                                                                     </option>
                                                                  )
                                                               )}
                                                            </select>
                                                         )}
                                                      </div>
                                                      {isRemovingItem &&
                                                      selectedItemToRemove ===
                                                         item._id ? (
                                                         <ImSpinner2 className="mr-1 h-7 w-7 animate-spin text-red-600" />
                                                      ) : (
                                                         <button
                                                            type="button"
                                                            className={`font-medium text-red-600 hover:text-red-500`}
                                                            onClick={() =>
                                                               handleRemoveItem(
                                                                  item._id
                                                               )
                                                            }
                                                         >
                                                            Remove
                                                         </button>
                                                      )}
                                                   </div>
                                                </div>
                                             </li>
                                          ))}
                                       </ul>
                                    </div>
                                 </div>
                              ) : isFetching || isLoading ? (
                                 <div className=" flex h-full w-full items-center justify-center font-bold text-teal-600">
                                    <ImSpinner2
                                       className="w-1/2 animate-spin "
                                       size={50}
                                    />
                                 </div>
                              ) : (
                                 <h1 className="pt-10 text-center font-bold text-gray-500">
                                    No items in cart
                                 </h1>
                              )}
                           </div>
                           <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                              <div className="flex justify-between text-base font-medium ">
                                 <p>Subtotal</p>
                                 <p className="">
                                    {cartData?.totalPrice.toLocaleString(
                                       'en-US',
                                       {
                                          style: 'currency',
                                          currency: 'USD'
                                       }
                                    ) || '00.00'}
                                 </p>
                              </div>
                              <p className="mt-0.5 text-sm text-gray-500">
                                 Shipping and taxes calculated at checkout.
                              </p>
                              <div className="mt-6">
                                 <button
                                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-teal-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-teal-700 disabled:bg-teal-800 disabled:hover:bg-teal-800 "
                                    disabled={disableCheckout()}
                                    onClick={() => handleCheckout()}
                                 >
                                    Checkout
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CartSlideOver;
