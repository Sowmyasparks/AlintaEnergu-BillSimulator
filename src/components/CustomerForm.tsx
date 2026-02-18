import type { FC } from 'react';
import { useForm } from 'react-hook-form';

interface CustomerInfo {
  firstName: string;
  email: string;
  postcode: string;
  connectionType: 'residential' | 'commercial';
  hasSmartMeter: boolean;
}

interface CustomerFormProps {
  onFormSubmit: (data: CustomerInfo) => void;
}

// Simple helper to create network lag
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const CustomerForm: FC<CustomerFormProps> = ({ onFormSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerInfo>({
    defaultValues: {
      connectionType: 'residential',
      hasSmartMeter: false
    }
  });

  const internalSubmit = async (data: CustomerInfo) => {
    // Call to database goes here
    await sleep(1000); 
    onFormSubmit(data);
  };

  return (
    <div className="bg-white m-4 p-8 shadow-xl rounded-2xl border-t-4 border-alinta-orange">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>

      <form onSubmit={handleSubmit(internalSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">First Name</label>
          <input
            id="firstName"
            {...register("firstName", { required: "Please enter your name" })}
            className={`w-full mt-1 p-3 border rounded-lg outline-none transition-all ${
              errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-alinta-orange'
            }`}
            placeholder="e.g. Alinta"
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
          <input
            id='email'
            {...register("email", { 
              required: "Email is required",
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Please enter a valid email" }
            })}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alinta-orange outline-none"
            placeholder="alinta@energy.com.au"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Postcode */}
          <div>
            <label htmlFor="postcode" className="block text-sm font-semibold text-gray-700">Postcode</label>
            <input
              id='postcode'
              {...register("postcode", { 
                required: "Postcode is required",
                pattern: { value: /^[0-9]{4}$/, message: "Must be 4 digits" }
              })}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alinta-orange outline-none"
              placeholder="3000"
            />
            {errors.postcode && <p className="text-red-500 text-xs mt-1">{errors.postcode.message}</p>}
          </div>

          {/* Connection type */}
          <div>
            <label htmlFor="connection" className="block text-sm font-semibold text-gray-700">Account Type</label>
            <select
              id='connection'
              {...register("connectionType")}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alinta-orange outline-none bg-white cursor-pointer"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>

        {/* Smart Meter toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
            <label htmlFor="smart-meter" className="cursor-pointer">
                <span className="text-sm font-bold text-gray-800">Smart Meter installed at premises?</span>
            </label>
            <input
                id="smart-meter"
                type="checkbox"
                {...register("hasSmartMeter")}
                className="w-5 h-5 accent-alinta-orange cursor-pointer"
            />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-alinta-orange hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSubmitting ? "SYNCING..." : "SYNC TO DASHBOARD"}
        </button>
      </form>
    </div>
  );
};