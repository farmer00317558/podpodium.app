import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { clientApi, useApi } from '../common/api';
import { useInput, useSecondCountDown } from '../hooks';

export default function Login() {
  const [sendCodeState, sendCode] = useApi(clientApi.users.sendVerifyCode);
  const [loginState, login] = useApi(clientApi.users.login);
  const route = useRouter();
  const phone = useInput('');
  const code = useInput('');
  const [countdown, startCountdown] = useSecondCountDown(60);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone.value || !code.value) {
      return;
    }
    await login({ phone: phone.value, verifyCode: code.value });
    route.push('/boss');
  };

  const hanldeSendCode = async () => {
    if (!phone.value) {
      return;
    }
    await sendCode({ phone: phone.value });
    startCountdown();
  };

  return (
    <div className="sm:w-96 px-4 justify-center h-full flex flex-col mx-auto text-sm">
      <div className="text-center text-3xl mb-6">登录</div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <input
          {...phone}
          type="tel"
          placeholder="手机号"
          className="border focus:ring-1 py-2 px-2 rounded-md focus:outline-none focus:border-blue-400 focus:ring-blue-400 border-grey-200 w-full"
        />
        <div className="flex flex-row">
          <input
            {...code}
            type="text"
            placeholder="验证码"
            className="border focus:ring-1 py-2 px-2 rounded-md focus:outline-none focus:border-blue-400 focus:ring-blue-400 border-grey-200 w-full"
          />
          <button
            onClick={hanldeSendCode}
            disabled={!countdown.done || sendCodeState.loading}
            className="py-2 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-400 focus:outline-none w-2/5 text-white rounded-md ml-2"
          >
            {countdown.done ? '发送验证码' : `${countdown.current}s`}
          </button>
        </div>
        <button className="py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-md w-full focus:outline-none">
          登录
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps = () => {
  return {
    props: {
      global: true,
    },
  };
};
