import { useNavigate } from "react-router";

export const BtcStaking = () => {
  const { bech32Address } = useCosmosWallet();
  const navigate = useNavigate();

  const { data: order } = useCosmwasmQuery<string>({
    contractAddress: MARKETPLACE_CONTRACT_ADDRESS,
    queryMsg: {
      get_order_from_owner: {
        owner: bech32Address,
      },
    },
  });

  return (
    <div>
      <div
        onClick={() => {
          navigate(`/order/${order}`);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="mx-1 cursor-pointer text-xl text-blue-500 no-underline"
      >
        My Order
      </div>
    </div>
  );
};
