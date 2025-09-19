import { useCosmwasmQuery } from "@/ui/common/hooks/client/useCosmwasmQuery";
import { ExpandIcon } from "@/ui/icons/ExpandIcon";
import { formatAddress } from "@/utils/format";

interface Props {
  orderAddress: string;
}

export const Information: React.FC<Props> = ({ orderAddress }) => {
  const {data: orderOwner} = useCosmwasmQuery({
    contractAddress: orderAddress ?? "",
    queryMsg: {
      get_owner: {}
    },
  });
  const {data: validator} = useCosmwasmQuery({
    contractAddress: orderAddress ?? "",
    queryMsg: {
      get_validator: {}
    },
  });
  return (
    <div>
      <div className="flex items-center text-4xl">
        <p>Order: {formatAddress(orderAddress)}</p>
        <a
          href={`https://testnet.babylon.explorers.guru/contract/${orderAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-1 no-underline"
        >
          <ExpandIcon  stroke="#7A8AA0" className = 'lg:w-7 lg:h-7 w-6 h-6'/>
        </a>
      </div>
      <div className="flex items-center text-base">
        <p>Owned by</p>
        <a
          href={`https://testnet.babylon.explorers.guru/account/${orderOwner}`}
          target="_blank"
          rel="noopener noreferrer"
              className="text-blue-500 no-underline hover:text-blue-700 mx-1 cursor-pointer"
        >
          {formatAddress(orderOwner)}
        </a>
      </div>
      <div className="flex items-center text-base">
        <p>Validator</p>
        <a
          href={`https://testnet.babylon.explorers.guru/contract/${validator}`}
          target="_blank"
          rel="noopener noreferrer"
              className="text-blue-500 no-underline hover:text-blue-700 mx-1 cursor-pointer"
        >
          {formatAddress(validator)}
        </a>
      </div>
    </div>
  );
};
