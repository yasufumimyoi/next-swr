import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ようこそ</h1>
      <p className="text-gray-600">
        このアプリケーションは、左側にメニュー、右側にメインコンテンツを表示するレイアウトを実装しています。
        メニューにはバッジが付いており、新着情報や通知数を表示することができます。
      </p>
    </div>
  );
}
