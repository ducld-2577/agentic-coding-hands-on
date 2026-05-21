import Image from 'next/image'

const baseTextClass = [
  'font-montserrat font-medium',
  'text-sm sm:text-base',
  'leading-7 sm:leading-8',
  'text-white/80',
].join(' ')

export function HomeRootFurther() {
  return (
    <section
      aria-label="Root Further"
      className={[
        'w-full flex flex-col items-center gap-8',
        'px-4 sm:px-8 md:px-[72px] lg:px-[104px]',
        'py-[80px] md:py-[120px]',
      ].join(' ')}
    >
      {/* ROOT FURTHER logo — centered, same image as hero but smaller */}
      <div className="relative w-full max-w-[400px] h-[100px]">
        <Image
          src="/login/Root_Further_Logo.png"
          alt="ROOT FURTHER"
          fill
          sizes="(max-width: 640px) 80vw, 400px"
          className="object-contain"
        />
      </div>

      {/* Description text block */}
      <div className="flex flex-col gap-6 max-w-[720px] w-full">
        {/* Paragraphs 1–3 */}
        <div className="flex flex-col gap-4">
          <p className={baseTextClass}>
            Đứng trước bối cảnh thay đổi như vũ bão của thời đại AI và yêu cầu ngày càng cao từ
            khách hàng, Sun* lựa chọn chiến lược đa dạng hóa năng lực để không chỉ nỗ lực trở
            thành tinh anh trong lĩnh vực của mình, mà còn hướng đến một cái đích cao hơn, nơi mọi
            Sunner đều là &quot;problem-solver&quot; - chuyên gia trong việc giải quyết mọi vấn đề,
            tìm lời giải cho mọi bài toán của dự án, khách hàng và xã hội.
          </p>
          <p className={baseTextClass}>
            Lấy cảm hứng từ sự đa dạng năng lực, khả năng phát triển linh hoạt cùng tinh thần đào
            sâu để bứt phá trong kỷ nguyên AI, &quot;Root Further&quot; đã được chọn để trở thành
            chủ đề chính thức của Lễ trao giải Sun* Annual Awards 2025.
          </p>
          <p className={baseTextClass}>
            Vượt ra khỏi nét nghĩa bề mặt, &quot;Root Further&quot; chính là hành trình chúng ta
            không ngừng vươn xa hơn, cắm rễ mạnh hơn, chạm đến những tầng &quot;địa chất&quot; ẩn
            sâu để tiếp tục tồn tại, vươn lên và nuôi dưỡng đam mê kiến tạo giá trị luôn cháy bỏng
            của người Sun*. Mượn hình ảnh bộ rễ liên tục đâm sâu vào lòng đất, mạnh mẽ len lỏi qua
            từng lớp &quot;trầm tích&quot; để thẩm thấu những gì tinh tuý nhất, người Sun* cũng
            đang &quot;hấp thụ&quot; dưỡng chất từ thời đại và những thử thách của thị trường để
            làm mới mình mỗi ngày, mở rộng năng lực và mạnh mẽ &quot;bén rễ&quot; vào kỷ nguyên AI
            - một tầng &quot;địa chất&quot; hoàn toàn mới, phức tạp và khó đoán, nhưng cũng hội tụ
            vô vàn tiềm năng cùng cơ hội.
          </p>
        </div>

        {/* Quote block */}
        <blockquote className="flex flex-col items-center gap-1 py-2">
          <p className="font-montserrat font-bold text-base sm:text-lg text-white italic text-center">
            &ldquo;A tree with deep roots fears no storm&rdquo;
          </p>
          <p className="font-montserrat text-sm text-white/60 italic text-center">
            (Cây sâu bén rễ, bão giông chẳng nề - Ngạn ngữ Anh)
          </p>
        </blockquote>

        {/* Paragraphs 4–5 */}
        <div className="flex flex-col gap-4">
          <p className={baseTextClass}>
            Trước giông bão, chỉ những tán cây có bộ rễ đủ mạnh mới có thể trụ vững. Một tổ chức
            với những cá nhân tự tin vào năng lực đa dạng, sẵn sàng kiến tạo và đón nhận thử thách,
            làm chủ sự thay đổi là tổ chức không chỉ vững vàng trước biến động, mà còn khai thác
            được mọi lợi thế, chinh phục các thách thức của thời cuộc. Không đơn thuần là tên gọi
            của chương mới trên hành trình phát triển tổ chức, &quot;Root Further&quot; còn như một
            lời cổ vũ, động viên mỗi chúng ta hãy dám tin vào bản thân, dám đào sâu, khai mở mọi
            tiềm năng, dám phá bỏ giới hạn, dám trở thành phiên bản đa nhiệm và xuất sắc nhất của
            mình. Bởi trong thời đại AI, đa dạng năng lực và tận dụng sức mạnh thời cuộc chính là
            điều kiện tiên quyết để trường tồn.
          </p>
          <p className={baseTextClass}>
            Không ai biết trước ẩn sâu trong &quot;lòng đất&quot; của ngành công nghệ và thị trường
            hiện đại còn biết bao tầng &quot;địa chất&quot; bí ẩn. Chỉ biết rằng khi &quot;Root
            Further&quot; đã trở thành tinh thần cội rễ, chúng ta sẽ không sợ hãi, mà càng thấy
            háo hức trước bất cứ vùng vô định nào trên hành trình tiến về phía trước. Vì ta luôn
            tin rằng, trong chính những miền vô tận đó, là bao điều kỳ diệu và cơ hội vươn mình
            đang chờ ta.
          </p>
        </div>
      </div>
    </section>
  )
}
