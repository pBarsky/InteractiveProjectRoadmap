using System;
using Moq;

namespace Roadmap.API.Tests.FakeClasses.Builders
{
    public class FakeSignInManagerBuilder
    {
        private Mock<FakeSignInManager> _mock = new Mock<FakeSignInManager>();

        public Mock<FakeSignInManager> Build()
        {
            return _mock;
        }

        public FakeSignInManagerBuilder With(Action<Mock<FakeSignInManager>> mock)
        {
            mock(_mock);
            return this;
        }
    }
}